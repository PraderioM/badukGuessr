from typing import List
from os.path import basename

from tqdm import tqdm

from input_processing import get_in_out_and_models_paths
from post_processing import store_processed_out_paths, store_skipped_files
from sgf_conversion import convert_sgf_to_angular_model


def main():
    file_paths, out_dir = get_in_out_and_models_paths()
    file_names: List[str] = []
    skipped_files: List[str] = []
    for file_path in tqdm(file_paths):
        stored_file_path = convert_sgf_to_angular_model(file_path, out_dir)
        if stored_file_path is None:
            skipped_files.append(file_path)
        else:
            file_names.append(basename(stored_file_path))

    store_processed_out_paths(file_names)
    store_skipped_files(skipped_files)


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    main()
