import pokedex_data
import encounters_data


def show_menu():
    print("Select an option:")
    print("1. Run Pokedex Data")
    print("2. Run Encounters Data")
    print("3. Exit")


def main():
    while True:
        show_menu()
        choice = input("Enter your choice: ")

        if choice == '1':
            pokedex_data.get_data()
        elif choice == '2':
            encounters_data.get_data()
        elif choice == '3':
            print("Exiting...")
            break
        else:
            print("Invalid choice, please try again.")


if __name__ == "__main__":
    main()
