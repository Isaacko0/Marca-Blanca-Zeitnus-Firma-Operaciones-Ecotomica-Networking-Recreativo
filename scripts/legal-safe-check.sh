#!/bin/bash
# legal-safe-check.sh - Ejecutar antes de commit para validar cumplimiento legal
# Ubicación: /c/Users/Isaacko0/HSCSG_v15_OS/scripts/legal-safe-check.sh
# Uso: ./scripts/legal-safe-check.sh (o se ejecuta automáticamente via pre-commit hook)

REPO_ROOT="$(git rev-parse --show-toplevel)"
ERRORS=0
WARNINGS=0

echo "🔒 Legal-safe pre-commit check..."
echo "Repo: $REPO_ROOT"
echo ""

# 1. Detectar backups en repo (patrón *_backup.*)
echo "🔍 1/5 Verificando backups en repo..."
BACKUPS_FOUND=$(find "$REPO_ROOT/docs" -name "*_backup*" -type f 2>/dev/null)
if [ -n "$BACKUPS_FOUND" ]; then
  echo "❌ ENCONTRADOS backups en repo (deben estar solo en ~/HSCSG_Backups_Local/):"
  echo "$BACKUPS_FOUND"
  ERRORS=1
else
  echo "✅ No hay backups en repo"
fi
echo ""

# 2. Detectar archivos grandes (>500KB) que puedan ser libros/documentos completos
echo "🔍 2/5 Verificando archivos grandes (>500KB)..."
LARGE_FILES=$(find "$REPO_ROOT/docs" -name "*.md" -size +500k -exec ls -lh {} \; 2>/dev/null)
if [ -n "$LARGE_FILES" ]; then
  echo "⚠️ Archivos grandes detectados (posibles libros/documentos completos):"
  echo "$LARGE_FILES"
  WARNINGS=1
else
  echo "✅ No hay archivos >500KB"
fi
echo ""

# 3. Detectar citas textuales largas (>90 chars) sin atribución fair use
echo "🔍 3/5 Verificando citas textuales largas (>90 chars)..."
LONG_QUOTES=$(grep -r '"[^"]\{90,\}"' "$REPO_ROOT/docs" --include="*.md" 2>/dev/null | grep -v "fair use" | grep -v "parafrasead" | grep -v "transformativ" | head -10)
if [ -n "$LONG_QUOTES" ]; then
  echo "⚠️ Posibles citas textuales >90 chars sin atribución fair use:"
  echo "$LONG_QUOTES"
  WARNINGS=1
else
  echo "✅ No hay citas textuales largas sin atribución"
fi
echo ""

# 4. Verificar carpeta _licencia_incompatible no existe en repo
echo "🔍 4/5 Verificando carpeta _licencia_incompatible..."
if [ -d "$REPO_ROOT/docs/_licencia_incompatible" ]; then
  echo "❌ Carpeta _licencia_incompatible encontrada en repo (debe estar solo en ~/HSCSG_Backups_Local/)"
  ERRORS=1
else
  echo "✅ Carpeta _licencia_incompatible no existe en repo"
fi
echo ""

# 5. Verificar ATTRIBUTIONS.md existe para contenido transformado
echo "🔍 5/5 Verificando ATTRIBUTIONS.md..."
if [ ! -f "$REPO_ROOT/docs/ATTRIBUTIONS.md" ]; then
  echo "⚠️ ATTRIBUTIONS.md no existe - recomendado crear para rastrear fuentes transformadas"
  WARNINGS=1
else
  echo "✅ ATTRIBUTIONS.md existe"
fi
echo ""

# Resumen
echo "========================================"
if [ $ERRORS -eq 1 ]; then
  echo "❌ VALIDACIÓN FALLADA - Errores críticos encontrados"
  echo "Corregir antes de commit:"
  echo "  - Mover backups a ~/HSCSG_Backups_Local/"
  echo "  - Eliminar _licencia_incompatible/ del repo"
  exit 1
elif [ $WARNINGS -eq 1 ]; then
  echo "⚠️ VALIDACIÓN CON ADVERTENCIAS - Commit permitido pero revisar:"
  echo "  - Archivos grandes: verificar que no sean documentos completos ajenos"
  echo "  - Citas largas: parafrasear o agregar atribución fair use"
  echo "  - ATTRIBUTIONS.md: crear para documentar fuentes"
  exit 0
else
  echo "✅ VALIDACIÓN EXITOSA - Seguro para commit"
  exit 0
fi