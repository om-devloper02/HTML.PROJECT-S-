# 🔔 Connectin Whizttech Alarm

**Overview:** A lightweight, single-page web alarm app (HTML/CSS/JS) — set time, add a note, and solve a math challenge to stop the alarm. Perfect for GitHub and GitHub Pages hosting.

---

## 🧠 Description

This is a simple yet stylish web-based alarm clock that:

* Displays a live digital clock
* Lets you set an alarm with an optional note
* Plays a sound when the alarm rings
* Requires solving a small math problem to stop the alarm
* Offers 5-minute snooze and light/dark theme toggle

All features are contained within one file: `index.html`.

---

## ✨ Features

* Real-time digital clock (HH:MM:SS)
* Alarm setup with custom note
* Math problem (addition, subtraction, multiplication) to stop alarm
* Snooze for 5 minutes
* Light/Dark theme switch
* Audio alert from an online MP3 source

---

## 🖼 Screenshot

Place the image below in your repository under `/assets/` and reference it in the README.

**Example:**

```markdown
![App Screenshot](./assets/A_digital_screenshot_showcases_a_web-based_alarm_a.png)
```

---

## ⚙ Requirements

* No backend or dependencies — works entirely in a browser.
* Modern browser (Chrome, Firefox, Edge, Safari).

---

## 🚀 How to Use Locally

1. Clone the repository:

```bash
git clone <your-repo-url>.git
cd <repo-folder>
```

2. Open `index.html` directly in your browser, or start a local server:

```bash
# Using Python 3 (localhost:8000)
python -m http.server 8000
# Then visit: http://localhost:8000
```

3. Choose a time, add a note, and click **Set Alarm**.

---<img width="600" height="900" alt="ALRAM SYSTEM" src="https://github.com/user-attachments/assets/38533bca-b6c9-418d-9f81-65876b3930de" />


## 🌐 Hosting on GitHub Pages

1. Push your `index.html` to the `main` or `gh-pages` branch.
2. Go to **Settings → Pages → Source → main branch / root**.
3. Wait a few minutes — your site will be live.

---

## ⚙ Customization Options

* Change the alarm sound by editing the `src` attribute of `<audio id="alarmSound">`.
* Modify `generateMathProblem()` to increase math difficulty.
* Adjust snooze duration in the `snoozeAlarm()` function.
* Edit CSS colors or fonts for branding.

---

## 🔒 Notes / Limitations

* The default sound source is external (soundbible.com). Some browsers may block autoplay audio.
* Behavior may differ on mobile devices or background tabs due to battery and autoplay policies.

---

## 📂 File Structure

```
connectin-whizttech-alarm/
├─ index.html
├─ assets/
│  └─ A_digital_screenshot_showcases_a_web-based_alarm_a.png
└─ README.md
```

---

## 🪪 License

MIT License — you are free to modify, distribute, and use this project.

---

## 🙌 Credits

* Original Code: `index.html` (HTML, CSS, JS)
* Alarm Sound: [soundbible.com](http://soundbible.com)

---

## ✅ Next Steps

* Want this README in Markdown with a professional GitHub style? I can format and commit it for you.
* You can also enhance `index.html` for accessibility, keyboard navigation, or PWA features.

Thanks for using **Connectin Whizttech Alarm!** 🚀
