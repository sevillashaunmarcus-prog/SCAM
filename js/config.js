/**
 * ==============================================================================
 * 💌 DATE INVITATION CONFIGURATION FILE
 * ==============================================================================
 * Dito mo i-eedit ang lahat ng details para sa date ninyo!
 * Hindi mo na kailangan galawin ang HTML o ibang files.
 * Baguhin lang ang mga values sa ibaba.
 * ==============================================================================
 */

// 1. ANG ACTUAL NA PLANO MO PARA SA DATE NINYO (Ito ang lalabas sa Final Page)
const FINAL_DATE_PLAN = {
    // 📅 Petsa na pinili mo (e.g., "Saturday, Oct 24, 2026")
    date: "Saturday, Oct 24, 2026",

    // ⏰ Oras ng sundo o meetup (e.g., "5:30 PM")
    time: "5:30 PM",

    // 🎬 Ano ang gagawin ninyo (Activity / Date Plan)
    activity: "Gala Food Park",

    // 🍝 Pagkain na kakainin ninyo
    food: "Japanese Foods",

    // 👕 Kulay ng damit na susuotin ninyo
    outfitColor: "Black + White",

    // 🚗 Saan mo siya susunduin
    pickupLocation: "Sunduin kita sainyo hehe 🚗",

    // 💌 Cute sweet message sa ilalim ng final screen
    specialMessage: "I can't wait to spend some time with you. Ganda! ❤️"
};

// 2. MGA PANGALAN AT WEBSITE SETTINGS
const APP_CONFIG = {
    // Pangalan ng aayain mo (Optional: iwanang blank kung ayaw mo ilagay)
    recipientName: "My Love",

    // Pangalan mo (Optional)
    senderName: "Your Date",

    // Headline sa landing page
    landingQuestion: "Will you go out with me? 💕",

    // Mga cute phrases na lalabas kapag paulit-ulit na pinipindot ang NO button
    noButtonQuotes: [
        "Are you sure? 🥺",
        "Think again! 😭",
        "Really? 💔",
        "Nice try! 😭",
        "The YES button looks better anyway. 😌",
        "Pretty please? 🥺👉👈",
        "Wait, did your finger slip? 🤭",
        "Error 404: 'NO' not found! 🤖",
        "Don't break my pixel heart! 💔",
        "Give it another thought! 🌸",
        "Are you really gonna say no to this face? 🥺",
        "Just press YES already! 🥰"
    ],

    // ASSET PATHS (Kung may GIF o Image ka, ilagay lang sa assets/gifs/ folder)
    // Kapag wala pang nilalagay, magpapakita ng cute pixel placeholder card!
    assets: {
        landingGif: "assets/images/landing-couple.svg",
        dateTimeGif: "assets/images/date-animation.svg",
        pickupGif: "assets/images/pickup-animation.svg",
        finalGif: "assets/images/final-couple.svg"
    },

    // Sound effects (Retro 8-bit web audio synthesizer - walang kailangang external audio file)
    enableSoundByDefault: true
};

// Ginagawang available sa window scope para mabasa ng app.js
if (typeof window !== "undefined") {
    window.FINAL_DATE_PLAN = FINAL_DATE_PLAN;
    window.APP_CONFIG = APP_CONFIG;
}
