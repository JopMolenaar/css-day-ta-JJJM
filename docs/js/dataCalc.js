const paths = document.querySelectorAll(`path`);
let countryCodes = [];
let alreadyGotCountryCodes = [];
const yearButtons = document.querySelectorAll(".yearButton");
function dataCalc(data) {
    localStorage.setItem("data", data);
    const localData = localStorage.getItem("data");
    console.log(data);
    const countries = {};
    yearButtons.forEach((yearButton) => {
        yearButton.addEventListener("click", function () {
            // Call giveCountryAColor function with the desired year and other necessary data
            const year = yearButton.innerHTML; // Example year
            const countryWithCount = data[year].attendees.countries; // Example data for the year
            const themeColor = data[year].color.hex; // Example theme color for the year
            giveCountryAColor(year, countryWithCount, themeColor);
        });
    });
}

function giveCountryAColor(year, countryWithCount, themeColor) {
    paths.forEach((path) => {
        path.setAttribute("style", `fill: #ECECEC`);
    });
    for (const [country, count] of Object.entries(countryWithCount)) {
        console.log(`country: ${country}, count: ${count}`);
        paths.forEach((path) => {
            if (path.dataset.country) {
                if (country === path.dataset.country) {
                    const color1 = themeColor; // Red
                    const color2 = "#ffffff"; // White

                    // Define the mix ratio (e.g., 30% white)
                    const mixRatio = 0.1;

                    // Convert the colors to RGB values
                    const rgbColor1 = hexToRgb(color1);
                    const rgbColor2 = hexToRgb(color2);

                    // Calculate the mixed color manually
                    const mixedColor = mixColors(rgbColor1, rgbColor2, mixRatio);

                    // Set the mixed color as the fill attribute of the path element
                    path.setAttribute("style", `fill: rgb(${mixedColor.r}, ${mixedColor.g}, ${mixedColor.b})`);

                    if (!alreadyGotCountryCodes.includes(country)) {
                        alreadyGotCountryCodes.push(country);
                    }
                }

                if (!countryCodes.includes(country)) {
                    countryCodes.push(country);
                }
            }
        });
    }
    countryCodes.forEach((code) => {
        if (!alreadyGotCountryCodes.includes(code) && code !== "SG") {
            console.log("missing:", code);
        }
    });
}

function hexToRgb(hex) {
    // Remove the '#' character if present
    hex = hex.replace("#", "");

    // Parse the hex color into RGB components
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Return an object with the RGB values
    return { r, g, b };
}

// Function to mix two RGB colors with a specified ratio
function mixColors(color1, color2, ratio) {
    // Calculate the mixed RGB components
    const mixedR = Math.round((1 - ratio) * color1.r + ratio * color2.r);
    const mixedG = Math.round((1 - ratio) * color1.g + ratio * color2.g);
    const mixedB = Math.round((1 - ratio) * color1.b + ratio * color2.b);

    // Return the mixed color as an RGB object
    return { r: mixedR, g: mixedG, b: mixedB };
}