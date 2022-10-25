from models import Game


def convert_sgf_to_angular_model(file_path: str, out_dir: str, models_dir: str):
    game = Game(file_path)

    game.save_as_angular_game(out_dir, models_dir)

    return game.get_angular_game_name()

