from typing import List

from tqdm import tqdm

from input_processing import get_in_out_and_models_paths
from post_processing import store_processed_out_paths, store_skipped_files
from sgf_conversion import convert_sgf_to_angular_model


def main():
    file_paths, out_dir = get_in_out_and_models_paths()
    out_paths: List[str] = []
    skipped_files: List[str] = []
    for file_path in tqdm(file_paths):
        out_path = convert_sgf_to_angular_model(file_path, out_dir)
        if out_path is None:
            skipped_files.append(file_path)
        else:
            out_paths.append(out_path)

    store_processed_out_paths(out_paths)
    store_skipped_files(skipped_files)


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    main()
