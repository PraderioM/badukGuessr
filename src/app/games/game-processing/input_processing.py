import os.path
from typing import List, Tuple
from glob import glob


def get_in_out_and_models_paths(default_input_folder='../new-sgf-files/',
                                default_output_folder='../games/',
                                default_models_folder='../') -> Tuple[List[str], str, str]:
    input_folder = get_folder('input', default_input_folder)
    output_folder = get_folder('output', default_output_folder)
    models_folder = get_folder('models', default_models_folder)

    # Iterate over input folder to find all sgf files in there.
    return glob(os.path.join(input_folder, '*.sgf')), output_folder, models_folder


def get_folder(folder_name: str, default_folder_path: str) -> str:
    folder = input(f'Please insert the {folder_name} folder path: ({default_folder_path}):\n\t')
    folder = pre_process_input(folder, default_folder_path)

    while not os.path.isdir(folder):
        folder = input(f'\'{folder}\' is not a directory. '
                       f'Please write again the {folder_name} folder path: ({default_folder_path}):\n\t')
        folder = pre_process_input(folder, default_folder_path)

    return folder


def pre_process_input(in_str: str, default: str) -> str:
    if in_str == '':
        return default
    return in_str
