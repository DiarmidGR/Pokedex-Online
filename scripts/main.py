import darken_sprites
import pokedex_data
import rename_images


def show_menu():
    print("Select an option:")
    print("1. Run Pokedex Data")
    print("2. Run Pokedex Images Renamer")
    print("3. Run Pokedex Sprites Darkener")
    print("4. Exit")


def main():
    while True:
        show_menu()
        choice = input("Enter your choice: ")

        if choice == '1':
            pokedex_data.get_data()
        elif choice == '2':
            rename_images.get_data()
        elif choice == '3':
            darken_sprites.darken_all_sprites()
        elif choice == '4':
            print("Exiting...")
            break
        else:
            print("Invalid choice, please try again.")


if __name__ == "__main__":
    main()
