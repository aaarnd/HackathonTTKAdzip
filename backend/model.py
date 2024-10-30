from vosk import Model, KaldiRecognizer
import os, json
import pyaudio
model = Model("vosk-model-small-ru-0.22")
rec = KaldiRecognizer(model, 16000)
p = pyaudio.PyAudio()
stream = p.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=8000)
stream.start_stream()
while True:
    data = stream.read(4000)
    if len(data) == 0:
        break
    if rec.AcceptWaveform(data) :
        x=json.loads(rec.Result())
        print(x["text"])
    else:
    #print (rec.PartialResult () )
        pass