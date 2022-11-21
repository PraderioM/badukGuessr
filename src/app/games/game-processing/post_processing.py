from os.path import relpath, splitext, dirname
from os import makedirs
from typing import List, Tuple


def store_processed_out_names(obj_names: List[str], out_file: str = './processing-results/names.txt') -> None:
    return store_string_list(str_list=[f'  {name},' for name in obj_names], out_file=out_file)


def store_processed_out_paths(name_path_list: List[Tuple[str, str]],
                              library_dir: str,
                              out_file: str = './processing-results/import_statements.txt') -> None:
    str_list = [
        f"import {{{name}}} from './{splitext(relpath(path, library_dir))[0]}';" for name, path in name_path_list
    ]
    return store_string_list(str_list=str_list,
                             out_file=out_file)


def store_skipped_files(file_list: List[str], out_file: str = './processing-results/skipped.txt'):
    return store_string_list(str_list=file_list, out_file=out_file)


def store_string_list(str_list: List[str], out_file: str):
    makedirs(dirname(out_file), exist_ok=True)
    with open(out_file, 'w') as out_file:
        for string in str_list:
            out_file.write(f'\n{string}')
