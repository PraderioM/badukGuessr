import json
from uuid import uuid4
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

    def to_json(self):
        capture_text = '' if self._capture is None else self._capture
        return {
            'color': self._color,
            'row': self._row,
            'column': self._column,
            'entrance': self._entrance,
            'capture': capture_text
        }

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
        self._board_size = self.get_metadata('SZ')
        self._initial_W_stones = self.get_metadata('AW')
        self._initial_B_stones = self.get_metadata('AB')
        self._black_name = self._post_process_name(self.get_metadata('PB'))
        self._black_rank = self._post_process_rank(self.get_metadata('BR'))
        self._white_name = self._post_process_name(self.get_metadata('PW'))
        self._white_rank = self._post_process_rank(self.get_metadata('WR'))
        self._date = self._post_process_date(self.get_metadata('DT'))
        self._result = self.get_metadata('RE')
        self._rules = self.get_metadata('RU')
        self._komi = self.get_metadata('KM')

        self._moves = self._get_moves()

    def empty_board_start(self):
        return self._initial_W_stones is None and self._initial_B_stones is None

    def are_rank_known(self):
        return self._white_rank is not None and self._black_rank is not None

    def is_19_by_19(self):
        return self._board_size is None or self._board_size == '19'

    def to_json(self):
        return {
            'B': self._black_name,
            'W': self._white_name,
            'BR': self._black_rank,
            'WR': self._white_rank,
            'DT': self._date,
            'RE': self._result,
            'KM': self.komi,
            'RU': self.rules,
            'moves': [move.to_json() for move in self._moves]
        }

    def save_as_JSON_file(self, out_dir: str) -> str:
        name_components = self._get_angular_game_name_components() + [str(uuid4()), 'json']
        out_file_name = '.'.join(name_components)
        out_file_path = os.path.join(out_dir, out_file_name)

        with open(out_file_path, 'w') as out_file:
            json.dump(self.to_json(), out_file)

        return out_file_path

    def get_angular_game_name(self):
        name_components = self._get_angular_game_name_components()
        name = ''.join(name_components[:1] + [component.capitalize() for component in name_components[1:]])
        return name

    def _get_angular_game_name_components(self) -> List[str]:
        black_name = [
            self._remove_non_alphabetic_characters(part.lower()) for part in self._black_name.split(' ') if part != ''
        ]
        white_name = [
            self._remove_non_alphabetic_characters(part.lower()) for part in self._white_name.split(' ') if part != ''
        ]
        date = self._date.split('-')
        return black_name + white_name + date

    def get_metadata(self, key: str) -> Optional[str]:
        # Look for the requested metadata via key search.
        search_result = re.search(key + '\[[^\]]*\]', self._sgf_game)

        # If not found return none.
        if search_result is None:
            return None

        # Otherwise extract the metadata and return.
        return search_result.group(0)[len(key) + 1:-1]

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
            col_as_txt, row_as_txt = sgf_text[pos + 3:pos + 5]
            sgf_text = sgf_text[pos + 6:]

            # Convert text to numbers and add move to the existing moves.
            col = self._convert_text_to_int(col_as_txt)
            row = self._convert_text_to_int(row_as_txt)
            if 0 <= row < self.BOARD_SIZE and 0 <= col < self.BOARD_SIZE:
                moves = self._add_move(row=row, column=col, color=color, moves=moves)

        return moves

    def _post_process_name(self, name: Optional[str]) -> Optional[str]:
        if name is None:
            return None

        # Remove things between parenthesis.
        name = self._remove_parenthesis(name)

        # Replace '-' and '_'  by spaces.
        name = name.replace('-', ' ')
        return name.replace('_', ' ')

    @staticmethod
    def _post_process_date(date_str: Optional[str]) -> Optional[str]:
        search_result = re.search('[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]', date_str)

        # If not found return unknown. If found complete date.
        if search_result is None:
            search_result = re.search('[0-9][0-9][0-9][0-9]-[0-9][0-9]', date_str)
            if search_result is None:
                search_result = re.search('[0-9][0-9][0-9][0-9]', date_str)
                if search_result is None:
                    return ''
                else:
                    return search_result.group(0) + '-01-01'
            else:
                return search_result.group(0) + '-01'
        else:
            return search_result.group(0)

    @staticmethod
    def _post_process_rank(rank: Optional[str]) -> Optional[str]:
        if rank is None:
            return None

        # We only accept ranks having 2 characters a number from 1-9 and a letter (either d or p)
        rank = rank.strip()
        rank = rank.replace('d', 'p')
        if len(rank) != 2:
            return None

        if not rank[0].isdigit():
            return None

        if rank[1] != 'p':
            return None

        return rank

    @staticmethod
    def _remove_parenthesis(text: str) -> str:
        for open_par, close_par in [('(', ')'), ('[', ']'), ('{', '}')]:
            par_start = text.find(open_par)
            while par_start != -1:
                par_end = text.find(close_par)
                if par_end != -1:
                    text = text[:par_start]
                else:
                    text = text[:par_start] + text[par_end:]
                par_start = text.find(open_par)

        return text

    @staticmethod
    def _remove_non_alphabetic_characters(text: str) -> str:
        alpha_chars = [char for char in text if char.isalpha()]
        return ''.join(alpha_chars)

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
                # If otherwise the neighbour is of the correct color we add it to the component and get its neighbours.
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
        board = [[Game.LIBERTY_LETTER] * Game.BOARD_SIZE for _ in range(Game.BOARD_SIZE)]
        for move in moves:
            if move.capture is None or move.capture >= len(moves):
                board[move.row][move.column] = move.color

        return board

    @staticmethod
    def _convert_text_to_int(c: str) -> int:
        return 'abcdefghijklmnopqrst'.find(c)

    @property
    def komi(self) -> str:
        if self._komi is None:
            return '6.5'

        return self._komi

    @property
    def rules(self) -> str:
        if self._rules is None:
            return 'Japanese'

        return self._rules
