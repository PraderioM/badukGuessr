from typing import Optional, Tuple

from models import Game


def convert_sgf_to_angular_model(file_path: str, out_dir: str, models_dir: str) -> Optional[Tuple[str, str]]:
    game = Game(file_path)

    if not game.are_rank_known():
        return None
    elif not game.empty_board_start():
        return None
    elif not game.is_19_by_19():
        return None
    else:
        return game.save_as_angular_game(out_dir, models_dir)

