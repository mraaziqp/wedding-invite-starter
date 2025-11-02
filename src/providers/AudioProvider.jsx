import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { getAssetPath } from "../utils/assetPaths.js";
import { STORAGE_KEYS } from "../utils/constants.js";
import { useTheme } from "./ThemeProvider.jsx";

const AudioContext = createContext();
export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    const audioRef = useRef(null);
    const hasStartedRef = useRef(false);
    const fadeRef = useRef(null);

    const { theme } = useTheme();
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [audioSource, setAudioSource] = useState(() =>
        getAssetPath("nasheed")
    );

    // Load theme audio if exists
    useEffect(() => {
        const src = theme?.assets?.nasheed ?? getAssetPath("nasheed");
        setAudioSource(src);
    }, [theme]);

    // Init Audio
    useEffect(() => {
        const audio = new Audio(audioSource);
        audio.loop = true;
        audio.preload = "auto";
        audio.volume = 0;
        audioRef.current = audio;

        return () => {
            if (audioRef.current) audioRef.current.pause();
        };
    }, [audioSource]);

    function fadeTo(target, speed = 0.05) {
        const audio = audioRef.current;
        if (!audio) return;

        cancelAnimationFrame(fadeRef.current);

        const step = () => {
            const diff = target - audio.volume;
            if (Math.abs(diff) < 0.02) {
                audio.volume = target;
                return;
            }
            audio.volume += diff * 0.1;
            fadeRef.current = requestAnimationFrame(step);
        };
        fadeRef.current = requestAnimationFrame(step);
    }

    const play = useCallback(async () => {
        const audio = audioRef.current;
        if (!audio) return;

        try {
            await audio.play();
            fadeTo(1);
            setIsPlaying(true);
            hasStartedRef.current = true;
        } catch (e) {
            console.warn("Autoplay blocked, waiting for user interaction");
        }
    }, []);

    const toggle = useCallback(async () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            fadeTo(0);
            setTimeout(() => audio.pause(), 500);
            setIsPlaying(false);
        } else {
            await play();
        }
    }, [isPlaying, play]);

    const forceStart = useCallback(async () => {
        // Used when seal clicked
        await play();
    }, [play]);

    return (
        <AudioContext.Provider
            value={{
                isPlaying,
                toggleAudio: toggle,
                startAudio: forceStart,
            }}
        >
            {children}
        </AudioContext.Provider>
    );
};
