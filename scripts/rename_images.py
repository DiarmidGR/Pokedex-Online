import os


def get_data():
    # Get the folder path from the user
    folder_path = input("Enter the path to the images folder: ")

    # Remove leading zeros from the filenames in the specified folder
    remove_leading_zeros_from_filenames(folder_path)


def remove_leading_zeros_from_filenames(folder_path):
    try:
        # List all files in the given directory
        for filename in os.listdir(folder_path):
            # Split the file into name and extension
            name, ext = os.path.splitext(filename)

            # Check if the file is an image
            if ext.lower() in ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff']:
                # Remove leading zeros from the name
                new_name = str(int(name)) + ext

                # Construct the full old and new file paths
                old_file = os.path.join(folder_path, filename)
                new_file = os.path.join(folder_path, new_name)

                # Rename the file
                os.rename(old_file, new_file)
                print(f'Renamed: {filename} -> {new_name}')

    except Exception as e:
        print(f'An error occurred: {e}')
