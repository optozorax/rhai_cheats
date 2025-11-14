"use strict"

let codes_rust = document.querySelectorAll("code:not(.ignore-auto)");


// Called on page load, get the user's preference on night mode, either from storage or system settings.
function get_browser_night_mode() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return "night";
    } else {
        return "day";
    }
}

// Update the body's class that affects on either day or night mode, based on the given mode.
function set_body_night_mode(night_mode) {
    let body = document.getElementsByTagName("body")[0];
    if (night_mode === "night") {
        body.classList.add("night-mode");
        body.classList.remove("day-mode");
    } else {
        body.classList.remove("night-mode");
        body.classList.add("day-mode");
    }
}

// Called by toggle button, enable or disable night mode and persist setting in localStorage.
function toggle_night_mode() {
    let night_mode = storage_get("night-mode") || get_browser_night_mode();

    if (night_mode === "night") {
        night_mode = "day";
    } else {
        night_mode = "night";
    }

    storage_set("night-mode", night_mode);
    set_body_night_mode(night_mode);
}

// Called by toggle button, enable or disable ligatures persist setting in localStorage.
function toggle_ligatures() {
    let body = document.getElementsByTagName("body")[0];
    let set = undefined;

    if (!codes_rust || codes_rust.length == 0) return;

    if (codes_rust[0].style.fontVariantLigatures === "common-ligatures") {
        set = "none";
        storage_set("ligatures", "no-ligatures");
    } else {
        set = "common-ligatures";
        storage_set("ligatures", "ligatures");
    }

    codes_rust.forEach((code) => {
        code.style.fontVariantLigatures = set;
    });
}

// Opens or closes the blue box on top of the page.
function toggle_legend() {
    let short = document.querySelectorAll("symbol-legend.short")[0];
    let long = document.querySelectorAll("symbol-legend.long")[0];
    let href = document.querySelectorAll("blockquote.legend div a")[0]

    if (short.style.display == "" || short.style.display == "block") {
        short.style.display = "none";
        long.style.display = "block";
        href.text = "➖";
    } else {
        short.style.display = "block";
        long.style.display = "none";
        href.text = "➕";
    }
}


// Called by toggle button, setting in localStorage.
function expand_all() {
    //
    // Expand all the tabs
    //
    let tabs = document.querySelectorAll("tab");
    for (let tab of tabs) {
        tab.style.display = "block";
    }

    let panels = document.querySelectorAll("tab > panel");
    for (let panel of panels) {
        panel.style.display = "initial";
    }

    let labels = document.querySelectorAll("tab > label");
    for (let label of labels) {
        label.style.display = "inline-block";
        // label.style.width = "100%";
        label.style.cursor = "initial";
        label.style.marginTop = "10px";
    }

    let inputs = document.querySelectorAll("tab > input");
    for (let input of inputs) {
        input.checked = false;
    }

    //
    // Expand all lifetime sections
    //
    let lifetime_explanations = document.querySelectorAll("lifetime-section > explanation");
    for (let le of lifetime_explanations) {
        le.style.display = "inherit";
    }

    //
    // Expand all types sections
    //
    let types_explanations = document.querySelectorAll("generics-section > description");
    for (let te of types_explanations) {
        te.style.display = "inherit";
    }
}


// Sets something to local storage.
function storage_set(key, value) {
    !!localStorage && localStorage.setItem(key, value);
}

// Retrieves something from local storage.
function storage_get(key) {
    return !!localStorage && localStorage.getItem(key);
}


// Make sure all "memory-bars" descriptions expand or collapse when clicked.
function memory_bars_expand_on_click() {
    let memory_bars = document.querySelectorAll("memory-row");

    for (let e of memory_bars) {
        e.onclick = (e) => {
            let section = e.target.closest("lifetime-section");
            let description = section.getElementsByTagName("explanation")[0];

            // Some elements just don't have any
            if (!description) return;

            if (!description.style.display || description.style.display == "none") {
                description.style.display = "inherit";
            } else {
                description.style.display = "none";
            }
        }
    }
}


// Make sure all "generics-section" expand when clicked.
function generics_section_expand_on_click() {
    let generics_section = document.querySelectorAll("generics-section > header");

    for (let e of generics_section) {
        e.onclick = (_) => {
            // Just expand the current one
            let description = e.parentElement.querySelector("description");

            if (!description.style.display || description.style.display == "none") {
                console.log(1)
                description.style.display = "inherit";
            } else {
                console.log(2)
                description.style.display = "none";
            }
        }
    }
}


// Use proper syntax since we don't want to write ````rust ...``` all the time.
codes_rust.forEach(code => {
    code.className = "language-rust";
});

// Run this after page had time to do first layout since these might take 1-2s, otherwise
// blocking page first render.
window.onload = () => {
    try {
        // Check if we have been asked to print
        if (window.location.hash == "#_print") {
            // In print mode, all we care for is to enable a few things
            toggle_ligatures();
            expand_all();

            // Have to set this to make CSS work for book
            set_body_night_mode("day");
        } else {
            // Executed on page load, this runs all toggles the user might have clicked
            // the last time based on localStorage.
            let ligatures = storage_get("ligatures");
            let night_mode = storage_get("night-mode") || get_browser_night_mode();

            if (ligatures === "ligatures") { toggle_ligatures(); }

            set_body_night_mode(night_mode);

            // Make sure all interactive content works
            memory_bars_expand_on_click();
            generics_section_expand_on_click();
        }
    } catch (e) {
        console.log(e);
    }
};
