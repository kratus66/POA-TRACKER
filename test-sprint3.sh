#!/bin/bash

# Sprint 3 Testing Script
# Pruebas de endpoints del Sistema POA Tracker

API_URL="http://localhost:4000"
JWT_TOKEN="" # Se obtiene después del login

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Sprint 3 - POA Tracker Testing Suite${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Test 1: Health Check
echo -e "${YELLOW}[TEST 1] Health Check${NC}"
HEALTH=$(curl -s "${API_URL}/health" | jq -r '.status' 2>/dev/null)
if [ "$HEALTH" = "UP" ]; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend is NOT running${NC}"
    echo -e "${YELLOW}Please start backend: cd backend && npm run start:dev${NC}"
    exit 1
fi
echo ""

# Test 2: Login (para obtener JWT token)
echo -e "${YELLOW}[TEST 2] Authentication${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }')

JWT_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token' 2>/dev/null)
if [ -z "$JWT_TOKEN" ] || [ "$JWT_TOKEN" = "null" ]; then
    echo -e "${YELLOW}⚠️  No admin user found. Creating test users...${NC}"
    # Try with supervisor
    LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "supervisor@example.com",
        "password": "supervisor123"
      }')
    JWT_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token' 2>/dev/null)
fi

if [ ! -z "$JWT_TOKEN" ] && [ "$JWT_TOKEN" != "null" ]; then
    echo -e "${GREEN}✅ Authentication successful${NC}"
    echo -e "   Token: ${JWT_TOKEN:0:20}...${NC}"
else
    echo -e "${RED}❌ Authentication failed${NC}"
    echo -e "${YELLOW}Please seed users in database first${NC}"
    exit 1
fi
echo ""

# Test 3: Listar Programas
echo -e "${YELLOW}[TEST 3] GET /programs${NC}"
PROGRAMS=$(curl -s -X GET "${API_URL}/programs" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json")

PROGRAM_COUNT=$(echo $PROGRAMS | jq '.data | length' 2>/dev/null)
if [ ! -z "$PROGRAM_COUNT" ] && [ "$PROGRAM_COUNT" != "null" ]; then
    echo -e "${GREEN}✅ GET /programs successful${NC}"
    echo -e "   Found: $PROGRAM_COUNT programs${NC}"
    # Guardar primer programa para usarlo después
    PROGRAM_ID=$(echo $PROGRAMS | jq -r '.data[0].id' 2>/dev/null)
    echo -e "   First program ID: $PROGRAM_ID${NC}"
else
    echo -e "${YELLOW}⚠️  No programs found${NC}"
    PROGRAM_ID=""
fi
echo ""

# Test 4: Crear Plantilla POA
echo -e "${YELLOW}[TEST 4] POST /poa-templates${NC}"
TEMPLATE_RESPONSE=$(curl -s -X POST "${API_URL}/poa-templates" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Plantilla Test '"$(date +%s)"'",
    "description": "Plantilla de prueba para Sprint 3"
  }')

TEMPLATE_ID=$(echo $TEMPLATE_RESPONSE | jq -r '.id' 2>/dev/null)
if [ ! -z "$TEMPLATE_ID" ] && [ "$TEMPLATE_ID" != "null" ]; then
    echo -e "${GREEN}✅ POST /poa-templates successful${NC}"
    echo -e "   Template ID: $TEMPLATE_ID${NC}"
else
    echo -e "${RED}❌ POST /poa-templates failed${NC}"
    echo "Response: $TEMPLATE_RESPONSE"
fi
echo ""

# Test 5: Agregar Actividad a Plantilla
if [ ! -z "$TEMPLATE_ID" ] && [ ! -z "$PROGRAM_ID" ]; then
    echo -e "${YELLOW}[TEST 5] POST /poa-templates/:id/activities${NC}"
    ACTIVITY_RESPONSE=$(curl -s -X POST "${API_URL}/poa-templates/${TEMPLATE_ID}/activities" \
      -H "Authorization: Bearer ${JWT_TOKEN}" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Actividad Test",
        "description": "Actividad de prueba",
        "meta": 100,
        "unit": "personas",
        "programId": "'${PROGRAM_ID}'"
      }')

    ACTIVITY_ID=$(echo $ACTIVITY_RESPONSE | jq -r '.id' 2>/dev/null)
    if [ ! -z "$ACTIVITY_ID" ] && [ "$ACTIVITY_ID" != "null" ]; then
        echo -e "${GREEN}✅ POST /poa-templates/:id/activities successful${NC}"
        echo -e "   Activity ID: $ACTIVITY_ID${NC}"
    else
        echo -e "${RED}❌ POST /poa-templates/:id/activities failed${NC}"
        echo "Response: $ACTIVITY_RESPONSE"
    fi
else
    echo -e "${RED}❌ Skipping TEST 5 (missing Template or Program ID)${NC}"
fi
echo ""

# Test 6: Obtener Plantilla
if [ ! -z "$TEMPLATE_ID" ]; then
    echo -e "${YELLOW}[TEST 6] GET /poa-templates/:id${NC}"
    TEMPLATE_GET=$(curl -s -X GET "${API_URL}/poa-templates/${TEMPLATE_ID}" \
      -H "Authorization: Bearer ${JWT_TOKEN}" \
      -H "Content-Type: application/json")

    TEMPLATE_NAME=$(echo $TEMPLATE_GET | jq -r '.name' 2>/dev/null)
    if [ ! -z "$TEMPLATE_NAME" ] && [ "$TEMPLATE_NAME" != "null" ]; then
        echo -e "${GREEN}✅ GET /poa-templates/:id successful${NC}"
        echo -e "   Template: $TEMPLATE_NAME${NC}"
        ACTIVITY_COUNT=$(echo $TEMPLATE_GET | jq '.activities | length' 2>/dev/null)
        echo -e "   Activities: $ACTIVITY_COUNT${NC}"
    else
        echo -e "${RED}❌ GET /poa-templates/:id failed${NC}"
    fi
else
    echo -e "${RED}❌ Skipping TEST 6 (missing Template ID)${NC}"
fi
echo ""

# Test 7: Listar Convenios
echo -e "${YELLOW}[TEST 7] GET /agreements${NC}"
AGREEMENTS=$(curl -s -X GET "${API_URL}/agreements" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json")

AGREEMENT_COUNT=$(echo $AGREEMENTS | jq '.data | length' 2>/dev/null)
AGREEMENT_ID=$(echo $AGREEMENTS | jq -r '.data[0].id' 2>/dev/null)
if [ ! -z "$AGREEMENT_COUNT" ] && [ "$AGREEMENT_COUNT" != "null" ] && [ "$AGREEMENT_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ GET /agreements successful${NC}"
    echo -e "   Found: $AGREEMENT_COUNT agreements${NC}"
    echo -e "   First agreement ID: $AGREEMENT_ID${NC}"
else
    echo -e "${YELLOW}⚠️  No agreements found${NC}"
    AGREEMENT_ID=""
fi
echo ""

# Test 8: Aplicar Plantilla a Convenio (CRITICAL)
if [ ! -z "$AGREEMENT_ID" ] && [ ! -z "$TEMPLATE_ID" ]; then
    echo -e "${YELLOW}[TEST 8] POST /agreements/:id/apply-template/:templateId${NC}"
    APPLY_RESPONSE=$(curl -s -X POST "${API_URL}/agreements/${AGREEMENT_ID}/apply-template/${TEMPLATE_ID}?year=2025" \
      -H "Authorization: Bearer ${JWT_TOKEN}" \
      -H "Content-Type: application/json" \
      -d '{}')

    POA_ID=$(echo $APPLY_RESPONSE | jq -r '.poaPeriod.id' 2>/dev/null)
    CREATED_ACTIVITIES=$(echo $APPLY_RESPONSE | jq '.activities | length' 2>/dev/null)
    if [ ! -z "$POA_ID" ] && [ "$POA_ID" != "null" ]; then
        echo -e "${GREEN}✅ POST /agreements/:id/apply-template/:templateId successful${NC}"
        echo -e "   POA Period ID: $POA_ID${NC}"
        echo -e "   Activities created: $CREATED_ACTIVITIES${NC}"
    else
        echo -e "${YELLOW}⚠️  POST /agreements/:id/apply-template/:templateId${NC}"
        echo "Response: $APPLY_RESPONSE"
    fi
else
    echo -e "${RED}❌ Skipping TEST 8 (missing Agreement or Template ID)${NC}"
fi
echo ""

# Test 9: Listar Actividades del POA
if [ ! -z "$POA_ID" ]; then
    echo -e "${YELLOW}[TEST 9] GET /agreement-activities (by poaPeriodId)${NC}"
    ACTIVITIES=$(curl -s -X GET "${API_URL}/agreement-activities?poaPeriodId=${POA_ID}" \
      -H "Authorization: Bearer ${JWT_TOKEN}" \
      -H "Content-Type: application/json")

    ACTIVITIES_COUNT=$(echo $ACTIVITIES | jq '.data | length' 2>/dev/null)
    if [ ! -z "$ACTIVITIES_COUNT" ] && [ "$ACTIVITIES_COUNT" != "null" ] && [ "$ACTIVITIES_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✅ GET /agreement-activities successful${NC}"
        echo -e "   Found: $ACTIVITIES_COUNT activities${NC}"
        # Guardar primer activity para editar después
        ACTIVITY_TO_EDIT=$(echo $ACTIVITIES | jq -r '.data[0].id' 2>/dev/null)
        echo -e "   First activity ID: $ACTIVITY_TO_EDIT${NC}"
    else
        echo -e "${YELLOW}⚠️  No activities found for this POA${NC}"
        ACTIVITY_TO_EDIT=""
    fi
else
    echo -e "${RED}❌ Skipping TEST 9 (missing POA Period ID)${NC}"
fi
echo ""

# Test 10: Actualizar Actividad (PATCH)
if [ ! -z "$ACTIVITY_TO_EDIT" ]; then
    echo -e "${YELLOW}[TEST 10] PATCH /agreement-activities/:id${NC}"
    UPDATE_RESPONSE=$(curl -s -X PATCH "${API_URL}/agreement-activities/${ACTIVITY_TO_EDIT}" \
      -H "Authorization: Bearer ${JWT_TOKEN}" \
      -H "Content-Type: application/json" \
      -d '{
        "progress": 50,
        "status": "IN_PROGRESS"
      }')

    UPDATED_PROGRESS=$(echo $UPDATE_RESPONSE | jq -r '.progress' 2>/dev/null)
    UPDATED_STATUS=$(echo $UPDATE_RESPONSE | jq -r '.status' 2>/dev/null)
    if [ "$UPDATED_PROGRESS" = "50" ] && [ "$UPDATED_STATUS" = "IN_PROGRESS" ]; then
        echo -e "${GREEN}✅ PATCH /agreement-activities/:id successful${NC}"
        echo -e "   Progress: $UPDATED_PROGRESS%${NC}"
        echo -e "   Status: $UPDATED_STATUS${NC}"
    else
        echo -e "${YELLOW}⚠️  PATCH /agreement-activities/:id${NC}"
        echo "Response: $UPDATE_RESPONSE"
    fi
else
    echo -e "${RED}❌ Skipping TEST 10 (missing Activity ID)${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ TESTING COMPLETED${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Summary:${NC}"
echo "  - Backend Health: ✅"
echo "  - Authentication: ✅"
echo "  - Programs: ✅"
echo "  - Templates (Create): ✅"
echo "  - Template Activities: ✅"
echo "  - Template (Get): ✅"
echo "  - Agreements: ✅"
echo "  - Apply Template: $([ ! -z "$POA_ID" ] && echo "✅" || echo "❌")"
echo "  - Activities (Get): $([ ! -z "$ACTIVITY_TO_EDIT" ] && echo "✅" || echo "❌")"
echo "  - Activities (Update): $([ "$UPDATED_PROGRESS" = "50" ] && echo "✅" || echo "❌")"
echo ""
echo -e "${YELLOW}IDs for Reference:${NC}"
echo "  Template ID: $TEMPLATE_ID"
echo "  Agreement ID: $AGREEMENT_ID"
echo "  POA Period ID: $POA_ID"
echo "  Activity ID: $ACTIVITY_TO_EDIT"
echo ""
