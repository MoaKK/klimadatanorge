import pandas as pd
from pathlib import Path

URL = "https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv"
OUTPUT = Path(__file__).parent.parent / "public" / "data" / "co2-norway.json"

COLUMNS = ["country", "year", "co2", "co2_per_capita", "share_global_co2"]

df = pd.read_csv(URL, usecols=COLUMNS)
df = df[df["country"] == "Norway"].dropna().reset_index(drop=True)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
df.to_json(OUTPUT, orient="records", indent=2)

print(f"Done. {len(df)} rows written to {OUTPUT}")
