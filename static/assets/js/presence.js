(() => {
    const music = document.getElementById("presence-music");
    const musicRow = document.getElementById("presence-music-row");
    const art = document.getElementById("presence-art");
    const desktop = document.getElementById("presence-desktop");
    const activityRow = document.getElementById("presence-activity-row");
    const desktopArt = document.getElementById("presence-desktop-art");
    const desktopFallback = desktopArt.querySelector("img");
    const clock = document.getElementById("presence-time");
    const clockFace = document.getElementById("presence-clock-face");
    const londonTime = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    for (let tick = 0; tick < 60; tick++) {
        const marker = document.createElement("i");
        marker.className = tick % 5 === 0 ? "clock-mark clock-mark-hour" : "clock-mark";
        marker.style.setProperty("--tick", tick);
        clockFace.append(marker);
    }

    function updateClock() {
        const parts = Object.fromEntries(londonTime.formatToParts(new Date()).map(({ type, value }) => [type, value]));
        const hour = Number(parts.hour) % 12;
        const minute = Number(parts.minute);
        const second = Number(parts.second);
        clockFace.querySelector(".clock-hour").style.transform = `rotate(${hour * 30 + minute / 2}deg)`;
        clockFace.querySelector(".clock-minute").style.transform = `rotate(${minute * 6 + second / 10}deg)`;
        clockFace.querySelector(".clock-second").style.transform = `rotate(${second * 6}deg)`;
        clock.textContent = `${parts.hour}:${parts.minute}`;
    }

    async function updatePresence() {
        try {
            const response = await fetch("https://api.lanyard.rest/v1/users/796417374424530944");
            if (!response.ok) throw new Error(`Lanyard returned ${response.status}`);
            const result = await response.json();
            if (!result.success) throw new Error(result.error.message);

            const { spotify, activities } = result.data;

            if (spotify) {
                art.replaceChildren();
                music.replaceChildren();
                const cover = document.createElement("img");
                cover.src = spotify.album_art_url;
                cover.alt = "";
                art.append(cover);

                const track = document.createElement("a");
                track.className = "presence-title";
                track.href = `https://open.spotify.com/track/${encodeURIComponent(spotify.track_id)}`;
                track.textContent = spotify.song;
                track.title = spotify.song;
                const artist = document.createElement("span");
                artist.className = "presence-detail";
                artist.textContent = spotify.artist;
                artist.title = spotify.artist;
                music.append(track, artist);
                musicRow.hidden = false;
            } else {
                musicRow.hidden = true;
            }

            const activity = activities.find((item) => item.name !== "Spotify");
            if (activity) {
                desktop.replaceChildren();
                desktopArt.replaceChildren(desktopFallback);
                const name = document.createElement("strong");
                name.className = "presence-title";
                name.textContent = activity.name;
                desktop.append(name);

                if (activity.assets?.large_image?.startsWith("mp:")) {
                    const icon = document.createElement("img");
                    icon.className = "presence-desktop-icon";
                    icon.src = `https://media.discordapp.net/${activity.assets.large_image.slice(3)}`;
                    icon.alt = "";
                    desktopArt.replaceChildren(icon);
                    if (activity.assets.small_image?.startsWith("mp:")) {
                        const smallIcon = document.createElement("img");
                        smallIcon.className = "presence-small-icon";
                        smallIcon.src = `https://media.discordapp.net/${activity.assets.small_image.slice(3)}`;
                        smallIcon.alt = "";
                        desktopArt.append(smallIcon);
                    }
                }
                activityRow.hidden = false;
            } else {
                activityRow.hidden = true;
            }
        } catch (error) {
            musicRow.hidden = true;
            activityRow.hidden = true;
            console.error(error);
        }
    }

    updateClock();
    updatePresence();
    setInterval(updateClock, 1000);
    setInterval(() => {
        if (!document.hidden) updatePresence();
    }, 60_000);
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) updatePresence();
    });
})();
