from os.path import dirname, isfile
from os import makedirs
from typing import List


def store_processed_out_paths(path_list: List[str],
                              out_file: str = './processing-results/processed_files.txt') -> None:
    return store_string_list(str_list=path_list,
                             out_file=out_file)


def store_skipped_files(file_list: List[str], out_file: str = './processing-results/skipped.txt'):
    return store_string_list(str_list=file_list, out_file=out_file)


def store_string_list(str_list: List[str], out_file: str):
    makedirs(dirname(out_file), exist_ok=True)
    write_format = 'a' if isfile(out_file) else 'w'
    with open(out_file, write_format) as out_file:
        for string in str_list:
            out_file.write(f'\n{string}')
