const paths = document.querySelectorAll(`path`);
let countryCodes = [];
let alreadyGotCountryCodes = [];
function dataCalc(data) {
    localStorage.setItem("data", data);
    const localData = localStorage.getItem("data");
    console.log(data);
    const countries = {};
    for (const [year, info] of Object.entries(data)) {
        // console.log(
        //     `${year}: days: ${info.days}, color: ${info.color.hex}, price: ${info.price}, attendees: ${info.attendees.count}, countries: ${info.attendees.countries} `
        // );
        giveCountryAColor(year, info.attendees.countries);
    }
}

function giveCountryAColor(year, countryWithCount) {
    for (const [country, count] of Object.entries(countryWithCount)) {
        console.log(`country: ${country}, count: ${count}`);
        paths.forEach((path) => {
            if (path.dataset.country) {
                if (country === path.dataset.country) {
                    // path.classList.add("bg-color");

                    const color1 = "#ff0000"; // Red
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

                    // path.fill = "fill: color-mix(in srgb, var(--theme-color), color percentage)";
                    // path.setAttribute("style", `fill: color-mix(in srgb, #ff0000), white 30% )`);
                    // path.setAttribute("style", `fill: color-mix(in srgb, #ff0000), white 30% )`);
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

// Assuming 'path' is a reference to the SVG path element
// const path = document.querySelector('path');

// Define the colors to mix

// Function to convert hex color to RGB object
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
