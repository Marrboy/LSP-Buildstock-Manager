from __future__ import annotations

from datetime import datetime
from pathlib import Path
from xml.sax.saxutils import escape
import zipfile


OUT_PATH = Path("docs/Laporan_Target_Sesi_4_JWP_Bookstock_Manager.docx")

NS_W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
NS_R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"

BLUE = "2E74B5"
DARK_BLUE = "1F4D78"
NAVY = "0B2545"
GRAY = "555555"
LIGHT_GRAY = "F2F4F7"
CALL_FILL = "F4F6F9"
WHITE = "FFFFFF"
BLACK = "000000"


def x(text: object) -> str:
    return escape(str(text), {'"': "&quot;"})


def attrs(**kwargs: str) -> str:
    return " ".join(f'w:{key}="{value}"' for key, value in kwargs.items())


def rpr(size: int | None = None, bold: bool = False, color: str | None = None, font: str = "Calibri") -> str:
    pieces = [
        f'<w:rFonts w:ascii="{font}" w:hAnsi="{font}" w:cs="{font}"/>',
    ]
    if bold:
        pieces.append("<w:b/>")
    if color:
        pieces.append(f'<w:color w:val="{color}"/>')
    if size:
        pieces.append(f'<w:sz w:val="{size * 2}"/><w:szCs w:val="{size * 2}"/>')
    return "<w:rPr>" + "".join(pieces) + "</w:rPr>"


def run(text: object, size: int | None = None, bold: bool = False, color: str | None = None) -> str:
    preserve = " xml:space=\"preserve\"" if str(text).startswith(" ") or str(text).endswith(" ") else ""
    return f"<w:r>{rpr(size=size, bold=bold, color=color)}<w:t{preserve}>{x(text)}</w:t></w:r>"


def p(
    text: object = "",
    style: str | None = None,
    align: str | None = None,
    before: int | None = None,
    after: int | None = None,
    line: int | None = None,
    bold: bool = False,
    color: str | None = None,
    size: int | None = None,
    num_id: int | None = None,
    ilvl: int = 0,
    page_break_before: bool = False,
    keep_next: bool = False,
) -> str:
    ppr: list[str] = []
    if style:
        ppr.append(f'<w:pStyle w:val="{style}"/>')
    if num_id is not None:
        ppr.append(f'<w:numPr><w:ilvl w:val="{ilvl}"/><w:numId w:val="{num_id}"/></w:numPr>')
    if align:
        ppr.append(f'<w:jc w:val="{align}"/>')
    spacing: list[str] = []
    if before is not None:
        spacing.append(f'w:before="{before * 20}"')
    if after is not None:
        spacing.append(f'w:after="{after * 20}"')
    if line is not None:
        spacing.append(f'w:line="{line}" w:lineRule="auto"')
    if spacing:
        ppr.append(f"<w:spacing {' '.join(spacing)}/>")
    if page_break_before:
        ppr.append("<w:pageBreakBefore/>")
    if keep_next:
        ppr.append("<w:keepNext/>")
    ppr_xml = f"<w:pPr>{''.join(ppr)}</w:pPr>" if ppr else ""
    return f"<w:p>{ppr_xml}{run(text, size=size, bold=bold, color=color)}</w:p>"


def rich_p(parts: list[tuple[str, bool]], style: str | None = None, after: int = 6) -> str:
    ppr = f'<w:pPr><w:pStyle w:val="{style}"/><w:spacing w:after="{after * 20}"/></w:pPr>' if style else f'<w:pPr><w:spacing w:after="{after * 20}"/></w:pPr>'
    return "<w:p>" + ppr + "".join(run(text, bold=bold) for text, bold in parts) + "</w:p>"


def cell(text: object, width: int, fill: str | None = None, bold: bool = False, color: str | None = None, align: str | None = None) -> str:
    shade = f'<w:shd w:fill="{fill}"/>' if fill else ""
    return (
        "<w:tc>"
        f"<w:tcPr><w:tcW w:w=\"{width}\" w:type=\"dxa\"/>{shade}<w:vAlign w:val=\"center\"/>"
        "<w:tcMar><w:top w:w=\"80\" w:type=\"dxa\"/><w:left w:w=\"120\" w:type=\"dxa\"/>"
        "<w:bottom w:w=\"80\" w:type=\"dxa\"/><w:right w:w=\"120\" w:type=\"dxa\"/></w:tcMar></w:tcPr>"
        + p(text, after=0, bold=bold, color=color, align=align)
        + "</w:tc>"
    )


def table(headers: list[str], rows: list[list[object]], widths: list[int]) -> str:
    assert sum(widths) == 9360, (sum(widths), widths)
    tbl_pr = (
        '<w:tblPr><w:tblW w:w="9360" w:type="dxa"/><w:tblInd w:w="120" w:type="dxa"/>'
        '<w:tblBorders><w:top w:val="single" w:sz="4" w:color="D9E2EC"/>'
        '<w:left w:val="single" w:sz="4" w:color="D9E2EC"/>'
        '<w:bottom w:val="single" w:sz="4" w:color="D9E2EC"/>'
        '<w:right w:val="single" w:sz="4" w:color="D9E2EC"/>'
        '<w:insideH w:val="single" w:sz="4" w:color="D9E2EC"/>'
        '<w:insideV w:val="single" w:sz="4" w:color="D9E2EC"/></w:tblBorders>'
        '<w:tblLayout w:type="fixed"/></w:tblPr>'
    )
    grid = "<w:tblGrid>" + "".join(f'<w:gridCol w:w="{w}"/>' for w in widths) + "</w:tblGrid>"
    header_row = "<w:tr><w:trPr><w:tblHeader/></w:trPr>" + "".join(
        cell(h, width, fill=LIGHT_GRAY, bold=True, color=NAVY) for h, width in zip(headers, widths)
    ) + "</w:tr>"
    body = []
    for row in rows:
        body.append("<w:tr>" + "".join(cell(value, width) for value, width in zip(row, widths)) + "</w:tr>")
    return "<w:tbl>" + tbl_pr + grid + header_row + "".join(body) + "</w:tbl>"


def callout(title: str, body: str) -> str:
    return (
        '<w:tbl><w:tblPr><w:tblW w:w="9360" w:type="dxa"/><w:tblInd w:w="120" w:type="dxa"/>'
        '<w:tblBorders><w:top w:val="single" w:sz="6" w:color="D9E2EC"/>'
        '<w:left w:val="single" w:sz="6" w:color="D9E2EC"/>'
        '<w:bottom w:val="single" w:sz="6" w:color="D9E2EC"/>'
        '<w:right w:val="single" w:sz="6" w:color="D9E2EC"/></w:tblBorders>'
        '<w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid><w:gridCol w:w="9360"/></w:tblGrid><w:tr>'
        f'<w:tc><w:tcPr><w:tcW w:w="9360" w:type="dxa"/><w:shd w:fill="{CALL_FILL}"/>'
        '<w:tcMar><w:top w:w="160" w:type="dxa"/><w:left w:w="180" w:type="dxa"/>'
        '<w:bottom w:w="160" w:type="dxa"/><w:right w:w="180" w:type="dxa"/></w:tcMar></w:tcPr>'
        + p(title, after=3, bold=True, color=NAVY)
        + p(body, after=0)
        + '</w:tc></w:tr></w:tbl>'
    )


def styles_xml() -> str:
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="{NS_W}">
  <w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="120" w:line="264" w:lineRule="auto"/></w:pPr><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="TitleDoc"><w:name w:val="Document Title"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:before="0" w:after="160"/><w:keepNext/></w:pPr><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:b/><w:color w:val="{NAVY}"/><w:sz w:val="52"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="SubtitleDoc"><w:name w:val="Document Subtitle"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="320"/></w:pPr><w:rPr><w:color w:val="{GRAY}"/><w:sz w:val="28"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="Heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="320" w:after="160"/></w:pPr><w:rPr><w:b/><w:color w:val="{BLUE}"/><w:sz w:val="32"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="Heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="120"/></w:pPr><w:rPr><w:b/><w:color w:val="{BLUE}"/><w:sz w:val="26"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="Heading 3"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="160" w:after="80"/></w:pPr><w:rPr><w:b/><w:color w:val="{DARK_BLUE}"/><w:sz w:val="24"/></w:rPr></w:style>
</w:styles>'''


def numbering_xml() -> str:
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="{NS_W}">
  <w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="singleLevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="&#8226;"/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="720"/></w:tabs><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum>
  <w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
  <w:abstractNum w:abstractNumId="1"><w:multiLevelType w:val="singleLevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/><w:lvlJc w:val="left"/><w:pPr><w:tabs><w:tab w:val="num" w:pos="720"/></w:tabs><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum>
  <w:num w:numId="2"><w:abstractNumId w:val="1"/></w:num>
</w:numbering>'''


def header_xml() -> str:
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="{NS_W}" xmlns:r="{NS_R}">
  {p("JWP Bookstock Manager | Tugas Pelatihan Sesi 4", after=0, color=GRAY, size=9)}
</w:hdr>'''


def footer_xml() -> str:
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="{NS_W}" xmlns:r="{NS_R}">
  {p("Dokumentasi Target Sesi 4", after=0, align="center", color=GRAY, size=9)}
</w:ftr>'''


def document_xml() -> str:
    parts: list[str] = []

    parts.append(p("UNIVERSITAS GUNADARMA", after=2, bold=True, color=GRAY, size=12))
    parts.append(p("Tugas Pelatihan Sesi Ke-4", style="TitleDoc"))
    parts.append(p("JWP Bookstock Manager - Sistem Inventori Toko Buku", style="SubtitleDoc"))
    parts.append(table(
        ["Informasi", "Keterangan"],
        [
            ["Nama aplikasi", "JWP Bookstock Manager"],
            ["Target sesi", "Menyelesaikan seluruh halaman aplikasi sesuai rancangan sebelumnya"],
            ["Studi kasus", "Inventori toko buku untuk buku, stationery, stok masuk, stok keluar, dan laporan mutasi"],
            ["Tanggal dokumen", "4 Juni 2026"],
            ["Status", "Siap untuk dokumentasi capture dan pengumpulan mentahan"],
        ],
        [2200, 7160],
    ))
    parts.append(p("", after=8))
    parts.append(callout(
        "Ringkasan hasil",
        "Aplikasi telah dilengkapi dengan halaman operasional, master data, laporan, profil, password, blueprint sistem, database SQL, ERD, serta dokumentasi mentahan untuk kebutuhan tugas pelatihan sesi ke-4."
    ))

    parts.append(p("1. Ringkasan Target Sesi 4", style="Heading1", page_break_before=True))
    parts.append(p("Berdasarkan tugas sebelumnya, sesi ke-4 berfokus pada penyelesaian seluruh halaman aplikasi sesuai rancangan yang sudah dibuat. Output yang disiapkan meliputi aplikasi berjalan, source code, database mentah, ERD, dokumentasi, dan daftar capture."))
    for item in [
        "Seluruh menu utama tersedia pada navigasi aplikasi.",
        "CRUD master kategori, produk, dan pengguna terhubung ke API.",
        "Transaksi buku masuk dan buku keluar memperbarui stok melalui database.",
        "Laporan mutasi dapat difilter, dicetak, dan diekspor sebagai CSV.",
        "Dokumentasi rancangan sistem tersedia dalam halaman blueprint dan file dokumentasi."
    ]:
        parts.append(p(item, num_id=1))

    parts.append(p("2. Daftar Halaman Yang Diselesaikan", style="Heading1"))
    page_rows = [
        [1, "Login admin", "Selesai", "Autentikasi email, password, dan status akun."],
        [2, "Dashboard analytics", "Selesai", "Statistik stok, grafik transaksi, stok terendah dan tertinggi."],
        [3, "Persediaan buku", "Selesai", "Monitoring stok, pencarian, filter, dan ekspor CSV."],
        [4, "Form buku masuk", "Selesai", "Invoice otomatis dan penambahan stok."],
        [5, "Form buku keluar", "Selesai", "Validasi stok agar tidak minus."],
        [6, "Master kategori", "Selesai", "Daftar, pencarian, detail, tambah, edit, hapus."],
        [7, "Form kategori", "Selesai", "Tambah dan edit kategori terintegrasi."],
        [8, "Master produk", "Selesai", "Katalog buku dan stationery beserta harga dan stok minimum."],
        [9, "Form produk", "Selesai", "Tambah dan edit produk."],
        [10, "Manajemen pengguna", "Selesai", "Daftar akun admin dan super admin."],
        [11, "Form pengguna", "Selesai", "Tambah dan edit role/status pengguna."],
        [12, "Laporan mutasi", "Selesai", "Filter, print, dan ekspor CSV."],
        [13, "Ubah profil", "Selesai", "Ubah nama, email, dan avatar pengguna."],
        [14, "Ubah password", "Selesai", "Validasi sandi lama, sandi baru, dan konfirmasi."],
        [15, "Blueprint sistem", "Selesai", "Deskripsi halaman, wireframe, database, alur, dan stack teknologi."],
    ]
    parts.append(table(["No", "Halaman", "Status", "Keterangan"], page_rows, [600, 2700, 1200, 4860]))

    parts.append(p("3. Fitur Inti Aplikasi", style="Heading1"))
    for item in [
        "Login admin menggunakan data akun dari database MySQL.",
        "Dashboard menampilkan total katalog, akumulasi stok masuk, stok keluar, stok rendah, dan produk terbanyak.",
        "Persediaan dapat dicari berdasarkan SKU atau nama produk, disaring berdasarkan kategori, dan diekspor ke CSV.",
        "Transaksi buku masuk dan keluar memakai nomor invoice otomatis.",
        "Sistem menolak transaksi keluar ketika jumlah melebihi stok tersedia.",
        "Master kategori dan produk memiliki proteksi hapus agar data yang masih digunakan tidak hilang.",
        "Laporan mutasi mendukung filter tipe transaksi, rentang tanggal, produk, kata kunci, print, dan CSV.",
        "Halaman profil dan password dipisahkan sesuai target rancangan halaman."
    ]:
        parts.append(p(item, num_id=1))

    parts.append(p("4. Struktur Mentahan Yang Disertakan", style="Heading1"))
    parts.append(table(
        ["Jenis mentahan", "Lokasi", "Keterangan"],
        [
            ["Source frontend", "src/", "Komponen React dan halaman aplikasi."],
            ["Source backend API", "server.js", "Endpoint Express untuk bootstrap, auth, CRUD, dan transaksi."],
            ["SQL database", "database/jwp_buildstock_manager.sql", "DDL, data awal, trigger stok, dan view stok rendah."],
            ["ERD", "database/erd-jwp-implementasi.svg", "Diagram relasi implementasi database."],
            ["Data fallback", "src/initialData.ts", "Data contoh bila API belum tersedia untuk preview."],
            ["Dokumentasi sesi 4", "docs/SESI-4-DOKUMENTASI.md", "Daftar fitur, cara menjalankan, dan checklist capture."],
            ["Dokumen Word", "docs/Laporan_Target_Sesi_4_JWP_Bookstock_Manager.docx", "Laporan target sesi 4 dalam format Word."],
        ],
        [2100, 3100, 4160],
    ))

    parts.append(p("5. Database dan Aturan Mutasi", style="Heading1"))
    parts.append(p("Database utama bernama jwp_buildstock_manager dan terdiri dari tabel users, categories, products, dan stock_transactions. Relasi penting yang digunakan adalah categories ke products serta products ke stock_transactions."))
    for item in [
        "products.category_id menggunakan foreign key ke categories.id dengan ON DELETE RESTRICT.",
        "stock_transactions.product_id menggunakan foreign key ke products.id dengan ON DELETE RESTRICT.",
        "Trigger BEFORE INSERT menolak quantity <= 0 dan menolak transaksi keluar jika stok tidak mencukupi.",
        "Trigger AFTER INSERT menambah stok untuk transaksi MASUK dan mengurangi stok untuk transaksi KELUAR.",
        "View vw_low_stock_products menampilkan produk dengan stok di bawah ambang minimum."
    ]:
        parts.append(p(item, num_id=1))

    parts.append(p("6. Cara Menjalankan Aplikasi", style="Heading1"))
    steps = [
        "Jalankan npm install untuk memasang dependency.",
        "Import database/jwp_buildstock_manager.sql melalui phpMyAdmin atau MySQL CLI.",
        "Salin .env.example menjadi .env lalu sesuaikan DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, dan DB_NAME.",
        "Jalankan npm run api untuk mengaktifkan backend di http://localhost:4000.",
        "Jalankan npm run dev untuk mengaktifkan frontend di http://localhost:3000.",
        "Login menggunakan akun penguji Super Admin."
    ]
    for item in steps:
        parts.append(p(item, num_id=2))

    parts.append(p("7. Akun Penguji", style="Heading1"))
    parts.append(table(
        ["Nama", "Email", "Password", "Role", "Status"],
        [
            ["Budi Santoso", "admin@toko-jwp.com", "password123", "Super Admin", "Aktif"],
            ["Ahmad Wijaya", "ahmad@toko-jwp.com", "password123", "Admin", "Aktif"],
            ["Siti Rahmawati", "siti@toko-jwp.com", "password123", "Admin", "Nonaktif"],
        ],
        [2100, 2800, 1700, 1600, 1160],
    ))

    parts.append(p("8. Checklist Capture Dokumentasi", style="Heading1"))
    capture_rows = [
        [1, "Login", "capture-01-login.png"],
        [2, "Dashboard", "capture-02-dashboard.png"],
        [3, "Persediaan Buku", "capture-03-persediaan.png"],
        [4, "Buku Masuk", "capture-04-buku-masuk.png"],
        [5, "Buku Keluar", "capture-05-buku-keluar.png"],
        [6, "Master Kategori", "capture-06-master-kategori.png"],
        [7, "Form Kategori", "capture-07-form-kategori.png"],
        [8, "Master Produk", "capture-08-master-produk.png"],
        [9, "Form Produk", "capture-09-form-produk.png"],
        [10, "Manajemen Pengguna", "capture-10-pengguna.png"],
        [11, "Form Pengguna", "capture-11-form-pengguna.png"],
        [12, "Laporan Mutasi", "capture-12-laporan.png"],
        [13, "Ubah Profil", "capture-13-profil.png"],
        [14, "Ubah Password", "capture-14-password.png"],
        [15, "Blueprint Sistem", "capture-15-blueprint.png"],
    ]
    parts.append(table(["No", "Halaman", "Nama file capture"], capture_rows, [600, 3600, 5160]))

    parts.append(p("9. Pemeriksaan Akhir", style="Heading1"))
    parts.append(p("Perintah verifikasi yang sudah digunakan untuk memastikan aplikasi siap:"))
    for item in ["npm run lint", "npm run build", "GET http://localhost:4000/api/health menghasilkan status ok"]:
        parts.append(p(item, num_id=1))
    parts.append(callout(
        "Kesimpulan",
        "Target sesi ke-4 telah dipenuhi: aplikasi selesai secara fungsional, mentahan disertakan, dokumentasi tersedia, dan daftar capture siap digunakan untuk bukti pengumpulan."
    ))

    sect_pr = (
        '<w:sectPr><w:headerReference w:type="default" r:id="rIdHeader1"/>'
        '<w:footerReference w:type="default" r:id="rIdFooter1"/>'
        '<w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/>'
        '<w:cols w:space="720"/><w:docGrid w:linePitch="360"/></w:sectPr>'
    )

    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="{NS_W}" xmlns:r="{NS_R}">
  <w:body>{''.join(parts)}{sect_pr}</w:body>
</w:document>'''


def content_types_xml() -> str:
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
  <Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
  <Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>'''


def rels_xml() -> str:
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>'''


def document_rels_xml() -> str:
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rIdHeader1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>
  <Relationship Id="rIdFooter1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>
</Relationships>'''


def core_xml() -> str:
    now = datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Laporan Target Sesi 4 - JWP Bookstock Manager</dc:title>
  <dc:creator>OpenAI Codex</dc:creator>
  <cp:lastModifiedBy>OpenAI Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">{now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">{now}</dcterms:modified>
</cp:coreProperties>'''


def app_xml() -> str:
    return '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>OpenAI Codex</Application>
  <DocSecurity>0</DocSecurity>
  <ScaleCrop>false</ScaleCrop>
</Properties>'''


def settings_xml() -> str:
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="{NS_W}">
  <w:zoom w:percent="100"/>
  <w:defaultTabStop w:val="720"/>
  <w:compat/>
</w:settings>'''


def build() -> None:
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(OUT_PATH, "w", compression=zipfile.ZIP_DEFLATED) as docx:
        docx.writestr("[Content_Types].xml", content_types_xml())
        docx.writestr("_rels/.rels", rels_xml())
        docx.writestr("word/document.xml", document_xml())
        docx.writestr("word/_rels/document.xml.rels", document_rels_xml())
        docx.writestr("word/styles.xml", styles_xml())
        docx.writestr("word/numbering.xml", numbering_xml())
        docx.writestr("word/settings.xml", settings_xml())
        docx.writestr("word/header1.xml", header_xml())
        docx.writestr("word/footer1.xml", footer_xml())
        docx.writestr("docProps/core.xml", core_xml())
        docx.writestr("docProps/app.xml", app_xml())
    print(OUT_PATH)


if __name__ == "__main__":
    build()
