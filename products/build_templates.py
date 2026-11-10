"""Genera las plantillas Excel del modelo 2. Uso: python3 build_templates.py"""
from datetime import date, time
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter as L

F = "Arial"
HEAD = PatternFill("solid", fgColor="1F3A5F")
INPUT = PatternFill("solid", fgColor="FFF8DC")
SOFT = PatternFill("solid", fgColor="EEF2F7")
thin = Side(style="thin", color="C9D1DC")
BOX = Border(left=thin, right=thin, top=thin, bottom=thin)

def base(ws):
    ws.sheet_view.showGridLines = False

def title(ws, text, legend):
    ws["A1"] = text; ws["A1"].font = Font(name=F, size=15, bold=True, color="1F3A5F")
    ws["A2"] = legend; ws["A2"].font = Font(name=F, size=10, italic=True, color="555555")

def header(ws, row, labels, widths):
    for i, (lab, w) in enumerate(zip(labels, widths), 1):
        c = ws.cell(row=row, column=i, value=lab)
        c.font = Font(name=F, bold=True, color="FFFFFF"); c.fill = HEAD
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True); c.border = BOX
        ws.column_dimensions[L(i)].width = w
    ws.row_dimensions[row].height = 30

def cell(ws, ref, value=None, fmt=None, fill=None, bold=False):
    c = ws[ref]
    if value is not None: c.value = value
    c.font = Font(name=F, bold=bold); c.border = BOX
    if fmt: c.number_format = fmt
    if fill: c.fill = fill
    return c

EUR = '#,##0.00 "€";[Red]-#,##0.00 "€"'

# ---------- 1. Control de ingresos y gastos ----------
def ingresos_gastos():
    wb = Workbook(); ws = wb.active; ws.title = "Movimientos"; base(ws)
    title(ws, "Control de ingresos y gastos",
          "Rellena solo las celdas amarillas (una línea por movimiento). La fila 5 es un ejemplo: sustitúyela. IVA y Total se calculan solos.")
    header(ws, 4, ["Fecha", "Concepto", "Tipo", "Categoría", "Base (sin IVA)", "% IVA", "IVA", "Total"],
           [13, 34, 12, 20, 16, 9, 14, 16])
    FIRST, LAST = 5, 304
    for r in range(FIRST, LAST + 1):
        cell(ws, f"A{r}", fmt="DD/MM/YYYY", fill=INPUT); cell(ws, f"B{r}", fill=INPUT)
        cell(ws, f"C{r}", fill=INPUT); cell(ws, f"D{r}", fill=INPUT)
        cell(ws, f"E{r}", fmt=EUR, fill=INPUT); cell(ws, f"F{r}", fmt="0%", fill=INPUT)
        cell(ws, f"G{r}", f'=IF(E{r}="","",ROUND(E{r}*F{r},2))', EUR)
        cell(ws, f"H{r}", f'=IF(E{r}="","",E{r}+G{r})', EUR)
    ws["A5"], ws["B5"], ws["C5"], ws["D5"], ws["E5"], ws["F5"] = date(2026, 1, 15), "Ejemplo: factura cliente", "Ingreso", "Servicios", 500, 0.21
    dv = DataValidation(type="list", formula1='"Ingreso,Gasto"', allow_blank=True)
    dv.error = "Elige Ingreso o Gasto"; ws.add_data_validation(dv); dv.add(f"C{FIRST}:C{LAST}")
    ws.freeze_panes = "A5"

    rs = wb.create_sheet("Resumen"); base(rs)
    title(rs, "Resumen mensual", "Cambia el año en la celda amarilla. El resto se calcula a partir de la hoja Movimientos.")
    rs["A3"] = "Año"; rs["A3"].font = Font(name=F, bold=True)
    cell(rs, "B3", 2026, "0", INPUT, True)
    header(rs, 5, ["Mes", "Ingresos (base)", "Gastos (base)", "Resultado", "IVA repercutido", "IVA soportado", "Diferencia de IVA"],
           [14, 18, 18, 18, 18, 18, 20])
    meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
    rng = lambda col: f"Movimientos!${col}${FIRST}:${col}${LAST}"
    def sumifs(col, tipo, m):
        return (f'=SUMIFS({rng(col)},{rng("C")},"{tipo}",{rng("A")},">="&DATE($B$3,{m},1),'
                f'{rng("A")},"<"&DATE($B$3,{m + 1},1))')
    for i, mes in enumerate(meses):
        r, m = 6 + i, i + 1
        cell(rs, f"A{r}", mes, bold=True)
        cell(rs, f"B{r}", sumifs("E", "Ingreso", m), EUR); cell(rs, f"C{r}", sumifs("E", "Gasto", m), EUR)
        cell(rs, f"D{r}", f"=B{r}-C{r}", EUR)
        cell(rs, f"E{r}", sumifs("G", "Ingreso", m), EUR); cell(rs, f"F{r}", sumifs("G", "Gasto", m), EUR)
        cell(rs, f"G{r}", f"=E{r}-F{r}", EUR)
    cell(rs, "A18", "Total año", fill=SOFT, bold=True)
    for col in "BCDEFG":
        cell(rs, f"{col}18", f"=SUM({col}6:{col}17)", EUR, SOFT, True)
    rs["A20"] = "Esta hoja es un organizador. No sustituye a la contabilidad oficial ni al asesoramiento fiscal."
    rs["A20"].font = Font(name=F, size=9, italic=True, color="777777")
    wb.save("plantillas/control-ingresos-gastos.xlsx")

# ---------- 2. Cuadrante de turnos ----------
def cuadrante():
    wb = Workbook(); t = wb.active; t.title = "Turnos"; base(t)
    title(t, "Tipos de turno", "Edita las celdas amarillas: código, descripción y horas de cada turno. Hasta 8 turnos.")
    header(t, 4, ["Código", "Descripción", "Horas"], [10, 26, 10])
    turnos = [("M", "Mañana", 8), ("T", "Tarde", 8), ("N", "Noche", 8), ("P", "Partido", 8), ("L", "Libre", 0), ("V", "Vacaciones", 0), (None, None, None), (None, None, None)]
    for i, (c, d, h) in enumerate(turnos):
        r = 5 + i
        cell(t, f"A{r}", c, fill=INPUT, bold=True).alignment = Alignment(horizontal="center")
        cell(t, f"B{r}", d, fill=INPUT); cell(t, f"C{r}", h, "0.0", INPUT)

    s = wb.create_sheet("Semana"); base(s)
    title(s, "Cuadrante semanal de turnos",
          "Escribe el nombre y elige el código de turno de cada día (celdas amarillas). La fila 6 es un ejemplo. Las horas se suman solas.")
    s["A3"] = "Semana del"; s["A3"].font = Font(name=F, bold=True)
    cell(s, "B3", date(2026, 1, 5), "DD/MM/YYYY", INPUT)
    dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
    header(s, 5, ["Persona"] + dias + ["Horas semana"], [24] + [12] * 7 + [14])
    FIRST, LAST = 6, 20
    dv = DataValidation(type="list", formula1="Turnos!$A$5:$A$12", allow_blank=True); s.add_data_validation(dv)
    for r in range(FIRST, LAST + 1):
        cell(s, f"A{r}", fill=INPUT)
        for c in range(2, 9):
            cell(s, f"{L(c)}{r}", fill=INPUT).alignment = Alignment(horizontal="center")
        cell(s, f"I{r}", f"=SUMPRODUCT(SUMIF(Turnos!$A$5:$A$12,B{r}:H{r},Turnos!$C$5:$C$12))", "0.0", bold=True)
    dv.add(f"B{FIRST}:H{LAST}")
    s["A6"] = "Ejemplo: Ana"
    for c, v in zip("BCDEFGH", ["M", "M", "T", "T", "M", "L", "L"]): s[f"{c}6"] = v
    cell(s, "A22", "Personas por turno", fill=SOFT, bold=True)
    for i in range(8):
        r = 23 + i
        cell(s, f"A{r}", f'=IF(Turnos!A{5 + i}="","",Turnos!B{5 + i})')
        for c in range(2, 9):
            col = L(c)
            cell(s, f"{col}{r}", f'=IF(Turnos!$A${5 + i}="","",COUNTIF({col}${FIRST}:{col}${LAST},Turnos!$A${5 + i}))', "0").alignment = Alignment(horizontal="center")
    s.freeze_panes = "B6"
    wb.save("plantillas/cuadrante-turnos.xlsx")

# ---------- 3. Agenda de citas ----------
def agenda():
    wb = Workbook(); a = wb.active; a.title = "Agenda"; base(a)
    title(a, "Agenda semanal de citas",
          "Escribe el nombre del cliente y el servicio en la franja que corresponda (celdas amarillas). La celda B6 es un ejemplo.")
    a["A3"] = "Semana del"; a["A3"].font = Font(name=F, bold=True)
    cell(a, "B3", date(2026, 1, 5), "DD/MM/YYYY", INPUT)
    dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    header(a, 5, ["Hora"] + dias, [10] + [24] * 6)
    FIRST = 6; slots = [(h, m) for h in range(9, 20) for m in (0, 30)] + [(20, 0)]
    LAST = FIRST + len(slots) - 1
    for i, (h, m) in enumerate(slots):
        r = FIRST + i
        cell(a, f"A{r}", time(h, m), "HH:MM", SOFT, True).alignment = Alignment(horizontal="center")
        for c in range(2, 8): cell(a, f"{L(c)}{r}", fill=INPUT)
    a["B6"] = "Ejemplo: Laura – corte"
    r = LAST + 2
    cell(a, f"A{r}", "Citas", fill=SOFT, bold=True)
    for c in range(2, 8):
        col = L(c); cell(a, f"{col}{r}", f"=COUNTA({col}{FIRST}:{col}{LAST})", "0", SOFT, True).alignment = Alignment(horizontal="center")
    cell(a, f"A{r + 1}", "Total", fill=SOFT, bold=True)
    cell(a, f"B{r + 1}", f"=SUM(B{r}:G{r})", "0", SOFT, True)
    a.freeze_panes = "B6"
    wb.save("plantillas/agenda-citas.xlsx")

ingresos_gastos(); cuadrante(); agenda(); print("ok")
