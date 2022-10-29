import os
import re
from typing import List, Optional, Tuple


class Move:
    def __init__(self, color: str,
                 row: int, column: int,
                 entrance: int, capture: Optional[int] = None):
        self._color = color
        self._row = row
        self._column = column
        self._entrance = entrance
        self._capture = capture

    def convert_to_angular_game(self) -> str:
        capture_text = 'null' if self._capture is None else self._capture
        return f"new Move('{self._color}', {self._row}, {self._column}, {self._entrance}, {capture_text})"

    def add_capture(self, capture: int):
        if self._capture is None:
            self._capture = capture

    @property
    def entrance(self) -> int:
        return self._entrance

    @property
    def capture(self) -> Optional[int]:
        return self._capture

    @property
    def row(self) -> int:
        return self._row

    @property
    def column(self) -> int:
        return self._column

    @property
    def color(self) -> str:
        return self._color


class Game:
    BOARD_SIZE = 19
    LIBERTY_LETTER = 'F'

    def __init__(self, sgf_file_path):
        # Extract whole sgf game.
        with open(sgf_file_path, 'r') as f:
            self._sgf_game = f.read().strip()

        # Get all necessary metadata from file
        self._black_name = self.get_metadata('PB')
        self._black_rank = self.get_metadata('BR')
        self._white_name = self.get_metadata('PW')
        self._white_rank = self.get_metadata('WR')
        self._date = self.get_metadata('DT')
        self._result = self.get_metadata('RE')

        self._moves = self._get_moves()

    def convert_to_angular_game(self):
        # Start writing the metadata.
        out_game = f"""new Game(
        '{self._black_name}',
        '{self._white_name}',
        '{self._black_rank}',
        '{self._white_rank}',
        new Date('{self._date}'),
        '{self._result}',
        [\n    """

        # Convert all the moves to angular format.
        angular_format_moves = [move.convert_to_angular_game() for move in self._moves]
        out_game = out_game + ',\n    '.join(angular_format_moves) + '\n  ]\n);\n'

        return out_game

    def save_as_angular_game(self, out_dir: str, models_dir: str):
        name_components = self._get_angular_game_name_components() + ['ts']
        out_file_name = '.'.join(name_components)
        out_file_path = os.path.join(out_dir, out_file_name)
        relative_models_path = os.path.relpath(models_dir, out_dir)
        models_file = os.path.join(relative_models_path, 'models')

        name = self.get_angular_game_name()
        preamble = "import { Game, Move } from " + f"'{models_file}';"
        preamble = preamble + f"\n\nexport const {name} = "
        text = preamble + self.convert_to_angular_game()
        with open(out_file_path, 'w') as out_file:
            out_file.write(text)

        return name

    def get_angular_game_name(self):
        name_components = self._get_angular_game_name_components()
        name = ''.join(name_components[:1] + [component.capitalize() for component in name_components[1:]])
        return name

    def _get_angular_game_name_components(self) -> List[str]:
        black_name = [part.lower() for part in self._black_name.split(' ') if part != '']
        white_name = [part.lower() for part in self._white_name.split(' ') if part != '']
        date = self._date.split('-')
        return black_name + white_name + date

    def get_metadata(self, key: str) -> Optional[str]:
        # Look for the requested metadata via key search.
        search_result = re.search(key+'\[[^\]]*\]', self._sgf_game)

        # If not found return none.
        if search_result is None:
            return None

        # Otherwise extract the metadata and return.
        return search_result.group(0)[len(key)+1:-1]

    def _get_moves(self) -> List[Move]:
        # Get a copy of the game info. We will be iterating until there are no more moves left.
        sgf_text = self._sgf_game

        # We will be alternating between B and W moves until we reach the end of the file.
        colors = ['B', 'W']
        color_index = 0

        # Initialize moves.
        moves: List[Move] = []

        while True:
            # first get color and update the color index.
            color = colors[color_index]
            color_index = 1 - color_index

            # Find next move.
            pos = sgf_text.find(f';{color}[')

            # If there is no next move we exit the loop.
            if pos == -1:
                break

            # Otherwise we extract the move and update the sgf_text.
            col_as_txt, row_as_txt = sgf_text[pos+3:pos+5]
            sgf_text = sgf_text[pos+6:]

            # Convert text to numbers and add move to the existing moves.
            col = self._convert_text_to_int(col_as_txt)
            row = self._convert_text_to_int(row_as_txt)
            moves = self._add_move(row=row, column=col, color=color, moves=moves)

        return moves

    @staticmethod
    def _add_move(row: int, column: int, color: str, moves: List[Move]) -> List[Move]:
        move = Move(color=color, row=row, column=column, entrance=len(moves))

        # Get board position.
        board = Game._get_board_position(moves + [move])

        # Get connected components of stones surrounding just placed stone.
        neighbours = Game._get_neighbours(row, column)

        # Check is something is captured.
        captures: List[Tuple[int, int]] = []
        for r, c in neighbours:
            if board[r][c] != color:
                new_captures = Game._get_captures(r, c, board)
                captures = captures + new_captures

        moves = Game._add_captures(moves, captures, move.entrance)

        return moves + [move]

    @staticmethod
    def _add_captures(moves: List[Move], captures: List[Tuple[int, int]], move_number: int) -> List[Move]:
        for row, col in captures:
            for move in moves:
                if move.capture is None and move.row == row and move.column == col:
                    move.add_capture(move_number)

        return moves

    @staticmethod
    def _get_captures(row: int, column: int, board: List[List[str]]) -> List[Tuple[int, int]]:
        color = board[row][column]
        connected_component: List[Tuple[int, int]] = [(row, column)]
        neighbours = Game._get_neighbours(row, column)

        # Build the connected component little by little while counting liberties.
        while len(neighbours) != 0:
            next_neighbours: List[Tuple[int, int]] = []

            # Iterate over all neighbours while building new ones.
            for r, c in neighbours:
                # If we found a liberty there is no need to continue since nothing is captured.
                cell_color = board[r][c]
                if cell_color == Game.LIBERTY_LETTER:
                    return []
                # If otherwise the neighbour is of the correct color we add it to the component and get it's neighbours.
                elif cell_color == color:
                    cell_neighbours = Game._get_neighbours(r, c)
                    # Check that neighbours are not repeated before adding them to the next list of neighbours.
                    for pos in cell_neighbours:
                        if not Game._is_position_in_list(pos, next_neighbours):
                            if not Game._is_position_in_list(pos, neighbours):
                                if not Game._is_position_in_list(pos, connected_component):
                                    next_neighbours.append(pos)

                    # Add position to the connected component.
                    connected_component.append((r, c))
            neighbours = next_neighbours

        return connected_component

    @staticmethod
    def _is_position_in_list(pos: Tuple[int, int], pos_list: List[Tuple[int, int]]):
        row, col = pos
        for r, c in pos_list:
            if r == row and c == col:
                return True

        return False

    @staticmethod
    def _get_neighbours(row: int, column: int) -> List[Tuple[int, int]]:
        neighbour_dist = (-1, 1)
        col_neighbour = [(row + dist, column) for dist in neighbour_dist if 0 <= row + dist < Game.BOARD_SIZE]
        row_neighbour = [(row, column + dist) for dist in neighbour_dist if 0 <= column + dist < Game.BOARD_SIZE]
        return col_neighbour + row_neighbour

    @staticmethod
    def _get_board_position(moves: List[Move]) -> List[List[str]]:
        board = [[Game.LIBERTY_LETTER]*Game.BOARD_SIZE for _ in range(Game.BOARD_SIZE)]
        for move in moves:
            if move.capture is None or move.capture >= len(moves):
                board[move.row][move.column] = move.color

        return board

    @staticmethod
    def _convert_text_to_int(c: str) -> int:
        return 'abcdefghijklmnopqrst'.find(c)
