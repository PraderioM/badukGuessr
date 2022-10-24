from input_processing import get_in_and_out_paths
from post_processing import show_processed_out_names
from sgf_conversion import convert_sgf_to_angular_model


def main():
    file_paths, out_dir = get_in_and_out_paths()
    out_names = []
    for file_path in file_paths:
        processed_out_name = convert_sgf_to_angular_model(file_path, out_dir)
        out_names.append(processed_out_name)

    show_processed_out_names(out_names)


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    main()

