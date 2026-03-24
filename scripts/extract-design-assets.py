from __future__ import annotations

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT / "frontend" / "public" / "assets" / "design"


ASSETS: dict[str, tuple[str, tuple[int, int, int, int]]] = {
    "logo-dark.png": ("Homepage.png", (146, 44, 328, 84)),
    "logo-light.png": ("Homepage.png", (84, 6120, 224, 6170)),
    "hero-kitchen.png": ("Homepage.png", (0, 160, 1440, 572)),
    "category-warehouse-card.png": ("Homepage.png", (144, 1004, 874, 1408)),
    "category-rebar-card.png": ("Homepage.png", (898, 1005, 1247, 1408)),
    "category-sharp-sand-card.png": ("Homepage.png", (144, 1443, 684, 1645)),
    "category-plaster-sand-card.png": ("Homepage.png", (714, 1444, 992, 1644)),
    "category-granite-card.png": ("Homepage.png", (1007, 1440, 1248, 1644)),
    "product-sharp-sand.png": ("Homepage.png", (219, 3655, 385, 3819)),
    "product-plaster-sand.png": ("Homepage.png", (500, 3655, 656, 3819)),
    "product-rebar.png": ("Homepage.png", (778, 3652, 951, 3819)),
    "product-marine-board.png": ("Homepage.png", (1072, 3652, 1214, 3819)),
    "product-granite.png": ("Homepage.png", (219, 4108, 381, 4274)),
    "product-rebar-rack.png": ("Homepage.png", (497, 4108, 657, 4274)),
    "product-cement.png": ("Homepage.png", (780, 4108, 947, 4274)),
    "product-marine-board-sand.png": ("Homepage.png", (1072, 4108, 1214, 4274)),
    "promo-buy-now-banner.png": ("Homepage.png", (165, 2840, 1226, 3345)),
    "promo-renovation-banner.png": ("Homepage.png", (145, 4746, 1228, 5056)),
    "testimonial-eric.png": ("Homepage.png", (158, 5696, 473, 6070)),
    "testimonial-simons.png": ("Homepage.png", (493, 5696, 810, 6070)),
    "testimonial-kaleb.png": ("Homepage.png", (827, 5696, 1147, 6070)),
    "footer-qr.png": ("Homepage.png", (1154, 6254, 1236, 6337)),
    "footer-payments.png": ("Homepage.png", (1028, 6457, 1360, 6510)),
    "auth-man.png": ("man.png", (0, 0, 508, 516)),
    "auth-woman.png": ("woman.png", (0, 0, 476, 538)),
}


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for filename, (source_name, box) in ASSETS.items():
        source_path = ROOT / source_name
        image = Image.open(source_path)
        crop = image.crop(box)
        crop.save(OUTPUT_DIR / filename)

    print(f"Generated {len(ASSETS)} design assets in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
