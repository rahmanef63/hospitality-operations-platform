#!/usr/bin/env python3
"""Generate deterministic, sample-free Hospitality Platform lo-fi loops.

The output contains only synthesized oscillators and generated noise. No third-party
samples are used. The released MP3 files are dedicated under CC0 1.0; see
public/audio/LICENSE.txt.
"""
from __future__ import annotations

import math
import subprocess
import wave
from pathlib import Path

import numpy as np

RATE = 44_100
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "audio"

TRACKS = [
    {
        "slug": "still-morning",
        "bpm": 72,
        "seed": 72,
        "chords": [[53, 57, 60, 64], [50, 53, 57, 60], [45, 48, 52, 55], [48, 52, 55, 59]],
        "scale": [65, 67, 69, 72, 74, 77],
        "tone": 0.92,
    },
    {
        "slug": "mountain-air",
        "bpm": 76,
        "seed": 76,
        "chords": [[55, 59, 62, 66], [52, 55, 59, 62], [48, 52, 55, 59], [50, 54, 57, 60]],
        "scale": [67, 69, 71, 74, 76, 79],
        "tone": 1.04,
    },
    {
        "slug": "night-courtyard",
        "bpm": 68,
        "seed": 68,
        "chords": [[48, 51, 55, 58], [44, 48, 51, 55], [46, 50, 53, 56], [43, 46, 50, 53]],
        "scale": [60, 63, 65, 67, 70, 72],
        "tone": 0.78,
    },
]


def hz(midi: int) -> float:
    return 440.0 * (2.0 ** ((midi - 69) / 12.0))


def pan_gain(pan: float) -> tuple[float, float]:
    angle = (pan + 1.0) * math.pi / 4.0
    return math.cos(angle), math.sin(angle)


def add_voice(buffer: np.ndarray, start: float, duration: float, frequency: float, amplitude: float,
              pan: float, rng: np.random.Generator, kind: str = "rhodes") -> None:
    start_i = max(0, int(start * RATE))
    count = min(int(duration * RATE), len(buffer) - start_i)
    if count <= 0:
        return
    t = np.arange(count, dtype=np.float64) / RATE
    if kind == "bass":
        wave_data = np.sin(2 * np.pi * frequency * t) + 0.18 * np.sin(4 * np.pi * frequency * t)
        env = np.minimum(1.0, t / 0.025) * np.exp(-t * 1.65)
    elif kind == "pluck":
        phase = rng.uniform(0, 2 * np.pi)
        wave_data = (
            np.sin(2 * np.pi * frequency * t + phase)
            + 0.32 * np.sin(4 * np.pi * frequency * t + phase * 0.7)
            + 0.09 * np.sin(6 * np.pi * frequency * t)
        )
        env = np.minimum(1.0, t / 0.008) * np.exp(-t * 3.5)
    else:
        phase = rng.uniform(0, 2 * np.pi)
        drift = 0.0022 * np.sin(2 * np.pi * 0.27 * t + phase)
        wave_data = (
            np.sin(2 * np.pi * frequency * (1 + drift) * t + phase)
            + 0.26 * np.sin(4 * np.pi * frequency * t + phase * 0.4)
            + 0.08 * np.sin(6 * np.pi * frequency * t)
        )
        env = np.minimum(1.0, t / 0.035) * np.exp(-t * 0.48)
    left, right = pan_gain(pan)
    signal = amplitude * env * wave_data
    buffer[start_i:start_i + count, 0] += signal * left
    buffer[start_i:start_i + count, 1] += signal * right


def add_kick(buffer: np.ndarray, start: float, amplitude: float) -> None:
    duration = 0.52
    start_i = int(start * RATE)
    count = min(int(duration * RATE), len(buffer) - start_i)
    if count <= 0:
        return
    t = np.arange(count, dtype=np.float64) / RATE
    phase = 2 * np.pi * (78 * t - 34 * t * t)
    signal = np.sin(phase) * np.exp(-t * 11.5) * amplitude
    buffer[start_i:start_i + count] += signal[:, None]


def add_snare(buffer: np.ndarray, start: float, amplitude: float, rng: np.random.Generator) -> None:
    duration = 0.34
    start_i = int(start * RATE)
    count = min(int(duration * RATE), len(buffer) - start_i)
    if count <= 0:
        return
    t = np.arange(count, dtype=np.float64) / RATE
    noise = rng.normal(0, 1, count)
    noise = np.concatenate(([noise[0]], np.diff(noise)))
    tone = np.sin(2 * np.pi * 185 * t) * 0.25
    env = np.exp(-t * 15.0)
    signal = (noise * 0.72 + tone) * env * amplitude
    buffer[start_i:start_i + count, 0] += signal * 0.94
    buffer[start_i:start_i + count, 1] += signal


def add_hat(buffer: np.ndarray, start: float, amplitude: float, rng: np.random.Generator) -> None:
    duration = 0.095
    start_i = int(start * RATE)
    count = min(int(duration * RATE), len(buffer) - start_i)
    if count <= 0:
        return
    t = np.arange(count, dtype=np.float64) / RATE
    noise = rng.normal(0, 1, count)
    high = np.concatenate(([noise[0]], np.diff(noise)))
    signal = high * np.exp(-t * 38) * amplitude
    buffer[start_i:start_i + count, 0] += signal
    buffer[start_i:start_i + count, 1] += signal * 0.92


def generate(track: dict[str, object]) -> Path:
    bpm = int(track["bpm"])
    beat = 60.0 / bpm
    bars = 16
    duration = bars * 4 * beat
    frames = int(duration * RATE)
    rng = np.random.default_rng(int(track["seed"]))
    audio = np.zeros((frames, 2), dtype=np.float64)
    chords = track["chords"]
    scale = track["scale"]
    tone = float(track["tone"])

    for bar in range(bars):
        chord = chords[bar % len(chords)]
        start = bar * 4 * beat
        for i, note in enumerate(chord):
            add_voice(audio, start, 4.25 * beat, hz(note), 0.105 * tone, -0.54 + i * 0.36, rng)
        root = chord[0] - 12
        add_voice(audio, start, 1.7 * beat, hz(root), 0.15, -0.08, rng, "bass")
        add_voice(audio, start + 2 * beat, 1.45 * beat, hz(root + 7), 0.12, 0.08, rng, "bass")

        for beat_index in range(4):
            beat_at = start + beat_index * beat
            if beat_index in (0, 2):
                add_kick(audio, beat_at, 0.29 if beat_index == 0 else 0.23)
            if beat_index in (1, 3):
                add_snare(audio, beat_at, 0.105, rng)
            add_hat(audio, beat_at, 0.028, rng)
            add_hat(audio, beat_at + beat * 0.54, 0.018, rng)

        if bar % 2 == 1:
            for step in (0.5, 1.5, 2.75):
                note = scale[int(rng.integers(0, len(scale)))]
                add_voice(audio, start + step * beat, 1.15 * beat, hz(note), 0.055, rng.uniform(-0.45, 0.45), rng, "pluck")

    # Generated tape noise and sparse crackle: no samples.
    noise = rng.normal(0, 1, frames)
    kernel = np.ones(420) / 420
    low = np.convolve(noise, kernel, mode="same")
    hiss = (noise - low) * 0.0038
    audio[:, 0] += hiss
    audio[:, 1] += np.roll(hiss, 31) * 0.92
    for _ in range(max(20, bars * 3)):
        index = int(rng.integers(0, frames - 400))
        length = int(rng.integers(40, 260))
        pop = rng.normal(0, 1, length) * np.exp(-np.arange(length) / 34) * rng.uniform(0.008, 0.022)
        audio[index:index + length, int(rng.integers(0, 2))] += pop

    # Gentle tape saturation and loop-edge crossfade.
    audio = np.tanh(audio * 1.18)
    fade_frames = int(0.5 * RATE)
    fade = np.linspace(0, 1, fade_frames)[:, None]
    start_copy = audio[:fade_frames].copy()
    end_copy = audio[-fade_frames:].copy()
    audio[:fade_frames] = start_copy * fade + end_copy * (1 - fade)
    audio[-fade_frames:] = end_copy * (1 - fade) + start_copy * fade
    peak = float(np.max(np.abs(audio))) or 1.0
    audio *= 0.86 / peak

    wav_path = OUT / f"{track['slug']}.wav"
    mp3_path = OUT / f"{track['slug']}.mp3"
    pcm = (audio * 32767).astype(np.int16)
    with wave.open(str(wav_path), "wb") as output:
        output.setnchannels(2)
        output.setsampwidth(2)
        output.setframerate(RATE)
        output.writeframes(pcm.tobytes())
    subprocess.run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(wav_path),
        "-af", "highpass=f=35,lowpass=f=7800,acompressor=threshold=-20dB:ratio=2.4:attack=20:release=240",
        "-codec:a", "libmp3lame", "-b:a", "112k", "-joint_stereo", "1", str(mp3_path),
    ], check=True)
    wav_path.unlink()
    return mp3_path


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for item in TRACKS:
        path = generate(item)
        print(f"generated {path.relative_to(ROOT)} ({path.stat().st_size} bytes)")
