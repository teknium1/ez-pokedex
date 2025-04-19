<div align="center">

# ✨🔴 Interactive Animated Pokedex ⚪✨

** Gotta Catch 'Em All... Interactively! (Gen 1 - First 50) **

[![Pokedex Demo GIF](placeholder.gif)](placeholder_link) <!-- Replace placeholder.gif with a link to an actual GIF or screenshot -->
<!-- Optional: Replace placeholder_link with a link to a live demo if you deploy it -->

*A dynamic web-based Pokedex featuring the first 50 Pokémon from Generation 1, brought to life with data from the PokeAPI, smooth animations, and insightful stat visualizations.*

---
</div>

> Dive into the world of Pokémon like never before! This project isn't just a list; it's an interactive experience. Click on your favorite Kanto region starter, witness their animated sprite wiggle, and uncover their secrets with detailed stats and descriptions.

---

## 🚀 Features Showcase 🚀

*   **📋 Pokémon Grid:** Displays the first 50 Pokémon in a clean, responsive card grid.
*   **✨ Animated Sprites:** Features **Generation 5 (Black/White) style animated GIFs** for Pokémon on cards and in the detail view (with fallbacks!).
*   **🖱️ Interactive Cards:** Click any Pokémon card to reveal a detailed modal view.
*   **📊 Dynamic Stats Chart:** Visualizes base stats (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed) using a sleek **Chart.js** horizontal bar chart.
*   **🔍 Detailed Information:** Access essential data for each Pokémon:
    *   🆔 National Pokedex Number
    *   🏷️ Name
    *   🎨 Types (with corresponding color badges)
    *   📏 Height & Weight
    *   📖 Flavor Text Description (from the games!)
    *   🖼️ High-Quality Artwork / Sprites (prioritizes animated, falls back gracefully)
*   **💨 Smooth Transitions & Animations:**
    *   Hover effects on cards.
    *   Modal fade-in/scale-up animation.
    *   Subtle pulse animation on the detail view sprite.
    *   Loading indicator with a spinning Pokeball.
*   **📱 Responsive Design:** Adapts beautifully to various screen sizes, from desktops to mobile phones.
*   **⚙️ Efficient Data Handling:** Uses `async/await` for fetching data and includes a simple cache to minimize redundant API calls.
*   **⚠️ Error Handling:** Includes fallbacks for images and basic error messages for data fetching issues.

---

<div align="center">

## 🛠️ Tech Stack & Tools 🛠️

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PokeAPI](https://img.shields.io/badge/PokeAPI-EF5350?style=for-the-badge&logo=pokemon&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Google Fonts](https://img.shields.io/badge/Google_Fonts-4285F4?style=for-the-badge&logo=googlefonts&logoColor=white)

</div>

---

## 🚦 Getting Started 🚦

Want to run this Pokedex on your local machine? Follow these simple steps:

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    ```
    *(Replace `YOUR_USERNAME` and `YOUR_REPOSITORY_NAME` with your actual GitHub details)*

2.  **Navigate to the Directory:**
    ```bash
    cd YOUR_REPOSITORY_NAME
    ```

3.  **Open `index.html`:**
    Simply open the `index.html` file in your favorite web browser (like Chrome, Firefox, Edge, Safari).
    *   *Tip:* On most systems, you can just double-click the file.

4.  **Explore!** 🎉 Start clicking on Pokémon and exploring their stats!

---

## 📁 File Structure 📁
```
.
├── index.html # Main HTML structure of the Pokedex page
├── style.css # CSS for styling, layout, and animations
├── script.js # JavaScript for API fetching, interactivity, and chart generation
└── README.md # You are here! 😉
└── placeholder.gif # (Optional) Replace with your actual demo GIF/image
```  


---

## 🌐 Key APIs & Libraries 🌐

*   **[PokeAPI (v2)](https://pokeapi.co/):** The incredible source of all Pokémon data used in this project. Huge thanks to the PokeAPI team!
*   **[Chart.js](https://www.chartjs.org/):** Used for creating the beautiful and responsive stats visualization chart.

---

## 💡 Potential Future Enhancements 💡

*   **Pagination/Infinite Scroll:** Load more than the first 50 Pokémon.
*   **Search Functionality:** Allow users to search for Pokémon by name or ID.
*   **Filtering/Sorting:** Filter by type, sort by ID, name, or stats.
*   **Evolution Chains:** Display the evolution line for each Pokémon.
*   **Sound Effects:** Add iconic Pokémon cries on click or hover.
*   **Local Storage:** Save favorite Pokémon or user settings.
*   **Progressive Web App (PWA):** Make it installable and usable offline.
*   **Different Animation Styles:** Option to switch between sprite styles (e.g., static Gen 1 vs. animated Gen 5).

---

## 🙌 Contributing 🙌

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME/issues) (if you plan to use it).

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License 📜

Distributed under the MIT License. See `LICENSE` file (if you add one) for more information.

*(Consider adding an actual `LICENSE` file to your repository - MIT is a common and permissive choice for open source)*

---

<div align="center">

**Thanks for checking out the Interactive Pokedex!**

🔴⚪🔴

</div>