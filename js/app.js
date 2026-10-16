/**
 * ==============================================================================
 * 🕹️ MAIN APP LOGIC & INTERACTION ENGINE
 * ==============================================================================
 * Manages game state, NO button shrink/grow interaction, step navigation,
 * user choices, and rendering the final date summary screen.
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    // Current step tracking
    let currentStep = 0; // 0: Landing, 1: Date/Time, 2: Activity, 3: Food, 4: Outfit, 5: Pickup, 6: Final
    let noClickCount = 0;

    // User's selections
    const userChoices = {
        date: "",
        time: "",
        dateType: "",
        food: "",
        outfitColor: "Pastel Pink",
        outfitHex: "#ffb6c1",
        pickupLocation: ""
    };

    // DOM Elements
    const pages = document.querySelectorAll(".page-step");
    const progressContainer = document.getElementById("progress-container");
    const progressHearts = document.querySelectorAll(".progress-heart");
    const hudStepBadge = document.getElementById("hud-step-badge");
    const soundToggleBtn = document.getElementById("sound-toggle-btn");
    const curtain = document.getElementById("pixel-curtain");

    // Landing Page Elements
    const btnYes = document.getElementById("btn-yes");
    const btnNo = document.getElementById("btn-no");
    const noQuoteBox = document.getElementById("no-quote-box");
    const landingCard = document.getElementById("landing-card");

    // Audio setup
    let isMuted = false;
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener("click", () => {
            isMuted = window.retroAudio.toggleMute();
            soundToggleBtn.textContent = isMuted ? "🔇" : "🔊";
            soundToggleBtn.title = isMuted ? "Unmute Sound" : "Mute Sound";
            if (!isMuted) window.retroAudio.playBlip(600);
        });
    }

    // Initialize Media Placeholders / Fallbacks
    setupMediaPlaceholders();

    // ==============================================================================
    // 💔 NO BUTTON INTERACTION
    // ==============================================================================
    if (btnNo && btnYes) {
        btnNo.addEventListener("click", (e) => {
            noClickCount++;
            window.retroAudio.playNoSound();

            // Burst particles at click location
            const rect = btnNo.getBoundingClientRect();
            window.pixelEffects.burstParticles(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                { symbols: ["💔", "🥺", "😭", "💧"], count: 10 }
            );

            // Screen shake
            landingCard.classList.remove("shake-screen");
            void landingCard.offsetWidth; // Force reflow
            landingCard.classList.add("shake-screen");

            // Pick cute quote
            const quotes = window.APP_CONFIG.noButtonQuotes || [
                "Are you sure? 🥺",
                "Think again! 😭",
                "Really? 💔",
                "Nice try! 😭",
                "The YES button looks better anyway. 😌"
            ];
            const quoteIndex = (noClickCount - 1) % quotes.length;
            noQuoteBox.textContent = quotes[quoteIndex];
            noQuoteBox.style.display = "block";

            // Scale calculations - Adaptive to screen width
            const screenW = window.innerWidth;
            const maxYesScale = screenW < 360 ? 1.35 : screenW < 480 ? 1.5 : 1.75;
            const noScale = Math.max(0.22, 1 - noClickCount * 0.14);
            const yesScale = Math.min(maxYesScale, 1 + noClickCount * 0.12);

            // Apply transformations
            btnNo.style.transform = `scale(${noScale})`;
            btnYes.style.transform = `scale(${yesScale})`;

            // If clicked 6 times or more, playfully vanish the NO button!
            if (noClickCount >= 6) {
                btnNo.style.opacity = "0";
                btnNo.style.pointerEvents = "none";
                setTimeout(() => {
                    btnNo.style.display = "none";
                    noQuoteBox.textContent = "Oops! 'NO' disappeared! Guess you have to say YES! 🥰";
                }, 200);
            }
        });
    }

    // ==============================================================================
    // ❤️ YES BUTTON INTERACTION
    // ==============================================================================
    if (btnYes) {
        btnYes.addEventListener("click", (e) => {
            window.retroAudio.playYesSound();

            // Burst hearts
            const rect = btnYes.getBoundingClientRect();
            window.pixelEffects.burstParticles(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                { symbols: ["💖", "💕", "✨", "❤️", "🥰"], count: 20, spread: 90 }
            );

            // Advance to Step 1
            setTimeout(() => {
                goToStep(1);
            }, 350);
        });
    }

    // ==============================================================================
    // 🧭 STEP NAVIGATION LOGIC
    // ==============================================================================
    function goToStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= pages.length) return;

        // Pixel curtain transition
        if (curtain) {
            curtain.classList.add("wipe-in");
            setTimeout(() => {
                switchPage(stepIndex);
                curtain.classList.remove("wipe-in");
                curtain.classList.add("wipe-out");
                setTimeout(() => {
                    curtain.classList.remove("wipe-out");
                }, 250);
            }, 180);
        } else {
            switchPage(stepIndex);
        }
    }

    function switchPage(stepIndex) {
        pages.forEach((page, idx) => {
            if (idx === stepIndex) {
                page.classList.add("active");
            } else {
                page.classList.remove("active");
            }
        });

        currentStep = stepIndex;
        updateHUD();
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Trigger Final Screen special logic
        if (stepIndex === 6) {
            populateFinalSummary();
            window.retroAudio.playVictorySound();
            window.pixelEffects.celebrate();
        }
    }

    function updateHUD() {
        if (!hudStepBadge || !progressContainer) return;

        if (currentStep === 0) {
            progressContainer.style.display = "none";
            hudStepBadge.innerHTML = `<img src="assets/stickers/pixel-heart.svg" class="hud-mini-icon" alt=""> <span>START 💕</span>`;
        } else if (currentStep === 6) {
            progressContainer.style.display = "none";
            hudStepBadge.innerHTML = `<img src="assets/stickers/pixel-star.svg" class="hud-mini-icon" alt=""> <span>QUEST COMPLETE 🏆</span>`;
        } else {
            progressContainer.style.display = "flex";
            hudStepBadge.innerHTML = `<img src="assets/stickers/pixel-bear.svg" class="hud-mini-icon" alt=""> <span>STEP ${currentStep} / 5</span>`;

            // Update hearts progress
            progressHearts.forEach((heart, idx) => {
                const stepNum = idx + 1;
                heart.classList.remove("active", "completed", "pending");
                if (stepNum < currentStep) {
                    heart.classList.add("completed");
                    heart.textContent = "💖";
                } else if (stepNum === currentStep) {
                    heart.classList.add("active");
                    heart.textContent = "💕";
                } else {
                    heart.classList.add("pending");
                    heart.textContent = "🤍";
                }
            });
        }
    }

    // ==============================================================================
    // 📅 PAGE 2: DATE & TIME LOGIC
    // ==============================================================================
    const inputDate = document.getElementById("date-input");
    const inputTime = document.getElementById("time-input");
    const btnNextStep2 = document.getElementById("btn-next-step-2");
    const btnBackStep2 = document.getElementById("btn-back-step-2");

    // Set minimum date to today
    if (inputDate) {
        const today = new Date().toISOString().split("T")[0];
        inputDate.min = today;
    }

    // Quick date chips
    document.querySelectorAll(".quick-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            window.retroAudio.playSelectSound();
            const daysToAdd = parseInt(chip.dataset.days || "0");
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + daysToAdd);
            inputDate.value = targetDate.toISOString().split("T")[0];
            if (!inputTime.value) inputTime.value = "17:30"; // default 5:30 PM
        });
    });

    if (btnNextStep2) {
        btnNextStep2.addEventListener("click", () => {
            if (!inputDate.value) {
                shakeElement(inputDate);
                alertCute("Please pick a date first! 📅");
                return;
            }
            if (!inputTime.value) {
                shakeElement(inputTime);
                alertCute("Please pick a time! ⏰");
                return;
            }

            userChoices.date = formatDisplayDate(inputDate.value);
            userChoices.time = formatDisplayTime(inputTime.value);

            window.retroAudio.playBlip(700);
            goToStep(2);
        });
    }

    if (btnBackStep2) {
        btnBackStep2.addEventListener("click", () => {
            window.retroAudio.playBlip(350);
            goToStep(0);
        });
    }

    // ==============================================================================
    // 🎬 PAGE 3: WHAT KIND OF DATE?
    // ==============================================================================
    const activityCards = document.querySelectorAll(".activity-card");
    const btnNextStep3 = document.getElementById("btn-next-step-3");
    const btnBackStep3 = document.getElementById("btn-back-step-3");

    activityCards.forEach(card => {
        card.addEventListener("click", () => {
            window.retroAudio.playSelectSound();
            activityCards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            userChoices.dateType = card.dataset.value;

            // Little burst
            const rect = card.getBoundingClientRect();
            window.pixelEffects.burstParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, {
                symbols: ["✨", "💕", "🌸"],
                count: 8
            });
        });
    });

    if (btnNextStep3) {
        btnNextStep3.addEventListener("click", () => {
            if (!userChoices.dateType) {
                alertCute("Pick an activity you'd love! 💕");
                return;
            }
            window.retroAudio.playBlip(700);
            goToStep(3);
        });
    }

    if (btnBackStep3) {
        btnBackStep3.addEventListener("click", () => {
            window.retroAudio.playBlip(350);
            goToStep(1);
        });
    }

    // ==============================================================================
    // 🍕 PAGE 4: WHAT FOOD?
    // ==============================================================================
    const foodCards = document.querySelectorAll(".food-card");
    const otherFoodContainer = document.getElementById("other-food-container");
    const inputFoodOther = document.getElementById("food-other-input");
    const btnNextStep4 = document.getElementById("btn-next-step-4");
    const btnBackStep4 = document.getElementById("btn-back-step-4");

    foodCards.forEach(card => {
        card.addEventListener("click", () => {
            window.retroAudio.playSelectSound();
            foodCards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");

            const foodVal = card.dataset.value;
            if (foodVal === "Other") {
                otherFoodContainer.style.display = "block";
                inputFoodOther.focus();
            } else {
                otherFoodContainer.style.display = "none";
            }
            userChoices.food = foodVal;
        });
    });

    if (btnNextStep4) {
        btnNextStep4.addEventListener("click", () => {
            if (!userChoices.food) {
                alertCute("Select a yummy food choice! 🍴");
                return;
            }
            if (userChoices.food === "Other") {
                const customFood = inputFoodOther.value.trim();
                if (!customFood) {
                    shakeElement(inputFoodOther);
                    alertCute("Please type what food you're craving! 🍕");
                    return;
                }
                userChoices.food = `Custom: ${customFood}`;
            }

            window.retroAudio.playBlip(700);
            goToStep(4);
        });
    }

    if (btnBackStep4) {
        btnBackStep4.addEventListener("click", () => {
            window.retroAudio.playBlip(350);
            goToStep(2);
        });
    }

    // ==============================================================================
    // 👕 PAGE 5: OUTFIT COLOR SELECTOR
    // ==============================================================================
    const colorSwatches = document.querySelectorAll(".color-swatch-btn");
    const outfitSvgShirt = document.getElementById("outfit-shirt-path");
    const outfitColorNameBadge = document.getElementById("outfit-color-name");
    const otherOutfitContainer = document.getElementById("other-outfit-container");
    const inputOutfitOther = document.getElementById("outfit-other-input");
    const btnNextStep5 = document.getElementById("btn-next-step-5");
    const btnBackStep5 = document.getElementById("btn-back-step-5");

    colorSwatches.forEach(swatch => {
        swatch.addEventListener("click", () => {
            window.retroAudio.playSelectSound();
            colorSwatches.forEach(s => s.classList.remove("selected"));
            swatch.classList.add("selected");

            const colorName = swatch.dataset.name;
            const colorHex = swatch.dataset.color;

            if (colorName === "Other") {
                if (otherOutfitContainer) {
                    otherOutfitContainer.style.display = "block";
                    if (inputOutfitOther) inputOutfitOther.focus();
                }
                const customVal = inputOutfitOther ? inputOutfitOther.value.trim() : "";
                userChoices.outfitColor = customVal ? `Custom: ${customVal}` : "Other";
                userChoices.outfitHex = "#fbcfe8";
                if (outfitColorNameBadge) outfitColorNameBadge.textContent = customVal || "Other";
                if (outfitSvgShirt) outfitSvgShirt.style.fill = "#fbcfe8";
            } else {
                if (otherOutfitContainer) otherOutfitContainer.style.display = "none";
                userChoices.outfitColor = colorName;
                userChoices.outfitHex = colorHex;
                if (outfitSvgShirt) outfitSvgShirt.style.fill = colorHex;
                if (outfitColorNameBadge) outfitColorNameBadge.textContent = colorName;
            }

            const rect = swatch.getBoundingClientRect();
            window.pixelEffects.burstParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, {
                symbols: ["✨", "👕", "💖"],
                count: 8
            });
        });
    });

    if (inputOutfitOther) {
        inputOutfitOther.addEventListener("input", (e) => {
            const val = e.target.value.trim();
            userChoices.outfitColor = val ? `Custom: ${val}` : "Other";
            if (outfitColorNameBadge) {
                outfitColorNameBadge.textContent = val || "Other";
            }
        });
    }

    if (btnNextStep5) {
        btnNextStep5.addEventListener("click", () => {
            const selectedSwatch = document.querySelector(".color-swatch-btn.selected");
            if (selectedSwatch && selectedSwatch.dataset.name === "Other") {
                const customOutfit = inputOutfitOther ? inputOutfitOther.value.trim() : "";
                if (!customOutfit) {
                    if (inputOutfitOther) shakeElement(inputOutfitOther);
                    alertCute("Please type your outfit color or idea! 👕");
                    return;
                }
                userChoices.outfitColor = `Custom: ${customOutfit}`;
            }

            window.retroAudio.playBlip(700);
            goToStep(5);
        });
    }

    if (btnBackStep5) {
        btnBackStep5.addEventListener("click", () => {
            window.retroAudio.playBlip(350);
            goToStep(3);
        });
    }

    // ==============================================================================
    // 🚗 PAGE 6: PICKUP LOCATION
    // ==============================================================================
    const inputPickup = document.getElementById("pickup-input");
    const btnFinish = document.getElementById("btn-finish");
    const btnBackStep6 = document.getElementById("btn-back-step-6");

    if (btnFinish) {
        btnFinish.addEventListener("click", () => {
            const loc = inputPickup.value.trim();
            if (!loc) {
                shakeElement(inputPickup);
                alertCute("Where should I pick you up? 🚗");
                return;
            }

            userChoices.pickupLocation = loc;
            goToStep(6);
        });
    }

    if (btnBackStep6) {
        btnBackStep6.addEventListener("click", () => {
            window.retroAudio.playBlip(350);
            goToStep(4);
        });
    }

    // ==============================================================================
    // 🏆 FINAL SUMMARY PAGE POPULATION
    // ==============================================================================
    function populateFinalSummary() {
        // 1. Her Answers Section
        setTextSafe("her-summary-date", userChoices.date || "Not specified");
        setTextSafe("her-summary-time", userChoices.time || "Not specified");
        setTextSafe("her-summary-activity", userChoices.dateType || "Romantic Date");
        setTextSafe("her-summary-food", userChoices.food || "Delicious Food");
        setTextSafe("her-summary-outfit", userChoices.outfitColor || "Pastel Pink");
        setTextSafe("her-summary-pickup", userChoices.pickupLocation || "Pickup location");

        // 2. Planned by Me Section (from FINAL_DATE_PLAN config)
        const plan = window.FINAL_DATE_PLAN || {};
        setTextSafe("my-plan-date", plan.date || userChoices.date);
        setTextSafe("my-plan-time", plan.time || userChoices.time);
        setTextSafe("my-plan-activity", plan.activity || "Special Date Activity");
        setTextSafe("my-plan-food", plan.food || "Romantic Dinner");
        setTextSafe("my-plan-outfit", plan.outfitColor || "Matching Outfits");
        setTextSafe("my-plan-pickup", plan.pickupLocation || userChoices.pickupLocation);
        const messageText = plan.specialMessage 
            ? (plan.specialMessage.startsWith('"') ? plan.specialMessage : `"${plan.specialMessage}"`) 
            : "\"I can't wait to spend some time with you. Ganda! ❤️\"";
        setTextSafe("final-special-message", messageText);
    }

    // ==============================================================================
    // 📋 COPY DATE SUMMARY OPTIONS (HER CHOICES vs WHAT I PLANNED)
    // ==============================================================================
    function copyHerChoices(e) {
        window.retroAudio.playSelectSound();
        const plan = window.FINAL_DATE_PLAN || {};
        const summaryText = 
`🌸 OUR DATE PLAN (HER CHOICES) 💕
────────────────────
📅 Date: ${userChoices.date || "Not specified"}
⏰ Time: ${userChoices.time || "Not specified"}
🎬 Date Type: ${userChoices.dateType || "Romantic Date"}
🍴 Food: ${userChoices.food || "Delicious Food"}
👕 Outfit Color: ${userChoices.outfitColor || "Pastel Pink"}
🚗 Pickup: ${userChoices.pickupLocation || "Pickup location"}

"${plan.specialMessage || "I can't wait to spend some time with you. Ganda! ❤️"}"`;

        if (e && e.clientX && e.clientY) {
            window.pixelEffects.burstParticles(e.clientX, e.clientY, { symbols: ["🌸", "📋", "✨"], count: 8 });
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(summaryText)
                .then(() => showToast("Copied Your Choices! 🌸📋"))
                .catch(() => fallbackCopy(summaryText));
        } else {
            fallbackCopy(summaryText);
        }
    }

    function copyMyPlan(e) {
        window.retroAudio.playSelectSound();
        const plan = window.FINAL_DATE_PLAN || {};
        const summaryText = 
`💖 OUR DATE PLAN (WHAT I PLANNED) 💕
────────────────────
📅 Date: ${plan.date || userChoices.date}
⏰ Time: ${plan.time || userChoices.time}
🎬 Activity: ${plan.activity || "Gala Food Park"}
🍝 Food: ${plan.food || "Japanese Foods"}
👕 Outfit Color: ${plan.outfitColor || "Black + White"}
🚗 Pickup: ${plan.pickupLocation || "Sunduin kita sainyo hehe 🚗"}

"${plan.specialMessage || "I can't wait to spend some time with you. Ganda! ❤️"}"`;

        if (e && e.clientX && e.clientY) {
            window.pixelEffects.burstParticles(e.clientX, e.clientY, { symbols: ["💖", "📋", "✨"], count: 8 });
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(summaryText)
                .then(() => showToast("Copied What I Planned! 💖📋"))
                .catch(() => fallbackCopy(summaryText));
        } else {
            fallbackCopy(summaryText);
        }
    }

    // Attach copy event listeners
    const btnCopyHerPlan = document.getElementById("btn-copy-her-plan");
    const btnCopyHerBox = document.getElementById("btn-copy-her-box");
    if (btnCopyHerPlan) btnCopyHerPlan.addEventListener("click", copyHerChoices);
    if (btnCopyHerBox) btnCopyHerBox.addEventListener("click", copyHerChoices);

    const btnCopyMyPlan = document.getElementById("btn-copy-my-plan");
    const btnCopyMyBox = document.getElementById("btn-copy-my-box");
    if (btnCopyMyPlan) btnCopyMyPlan.addEventListener("click", copyMyPlan);
    if (btnCopyMyBox) btnCopyMyBox.addEventListener("click", copyMyPlan);

    // Backward-compat for btn-copy-plan if present
    const btnCopyPlan = document.getElementById("btn-copy-plan");
    if (btnCopyPlan) btnCopyPlan.addEventListener("click", copyMyPlan);

    // Edit Choices Button
    const btnEditChoices = document.getElementById("btn-edit-choices");
    if (btnEditChoices) {
        btnEditChoices.addEventListener("click", () => {
            window.retroAudio.playBlip(400);
            goToStep(1); // Return to step 1 to edit
        });
    }

    // ==============================================================================
    // 🖼️ MEDIA PLACEHOLDER / FALLBACK SYSTEM
    // ==============================================================================
    function setupMediaPlaceholders() {
        const mediaContainers = document.querySelectorAll(".pixel-media-box");

        mediaContainers.forEach(container => {
            const img = container.querySelector("img");
            const placeholder = container.querySelector(".media-placeholder-view");

            if (!img) return;

            // If image has a valid src, display it by default
            if (img.getAttribute("src")) {
                img.style.display = "block";
                if (placeholder) placeholder.style.display = "none";
            } else {
                img.style.display = "none";
                if (placeholder) placeholder.style.display = "flex";
            }

            // Fallback to placeholder only when image fails to load (404/broken)
            img.addEventListener("error", () => {
                img.style.display = "none";
                if (placeholder) placeholder.style.display = "flex";
            });

            img.addEventListener("load", () => {
                img.style.display = "block";
                if (placeholder) placeholder.style.display = "none";
            });
        });
    }

    // ==============================================================================
    // 🛠️ HELPER FUNCTIONS
    // ==============================================================================
    function setTextSafe(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function shakeElement(el) {
        el.classList.add("shake-screen");
        setTimeout(() => el.classList.remove("shake-screen"), 450);
    }

    function alertCute(message) {
        showToast(message);
    }

    function showToast(text) {
        const existing = document.querySelector(".pixel-toast");
        if (existing) existing.remove();

        const toast = document.createElement("div");
        toast.className = "pixel-toast";
        toast.textContent = text;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 2600);
    }

    function fallbackCopy(text) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            showToast("Copied to clipboard! 📋💕");
        } catch (err) {
            showToast("Screenshot this screen! 📸");
        }
        document.body.removeChild(textarea);
    }

    function formatDisplayDate(dateStr) {
        try {
            const [y, m, d] = dateStr.split("-");
            const dt = new Date(y, m - 1, d);
            return dt.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            });
        } catch (e) {
            return dateStr;
        }
    }

    function formatDisplayTime(timeStr) {
        try {
            const [hours, mins] = timeStr.split(":");
            let h = parseInt(hours, 10);
            const ampm = h >= 12 ? "PM" : "AM";
            h = h % 12 || 12;
            return `${h}:${mins} ${ampm}`;
        } catch (e) {
            return timeStr;
        }
    }
});
