from typing import List


def show_processed_out_names(obj_names: List[str]) -> None:
    print("The following game objects have been created:")
    for name in obj_names:
        print(f'\t{name},')
