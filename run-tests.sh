#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_URL="${1:-http://localhost:4000}"
TIMEOUT=30

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   🧪 Sprint 3 - POA Tracker Testing Suite${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0
TEST_NUMBER=1

# Function to run a test
run_test() {
    local test_name="$1"
    local curl_cmd="$2"
    local expected_field="$3"
    
    echo -e "${YELLOW}[TEST $TEST_NUMBER]${NC} $test_name"
    
    # Execute curl command
    response=$(eval "$curl_cmd" 2>/dev/null)
    
    if [ -z "$response" ]; then
        echo -e "${RED}✗ FAILED${NC} - No response received"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        ((TEST_NUMBER++))
        return 1
    fi
    
    # Check if expected field exists in response
    if [ -n "$expected_field" ]; then
        if echo "$response" | jq -e "$expected_field" >/dev/null 2>&1; then
            echo -e "${GREEN}✓ PASSED${NC}"
            echo "Response: $(echo $response | jq -c '.' | head -c 100)..."
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            echo -e "${RED}✗ FAILED${NC} - Expected field not found: $expected_field"
            echo "Response: $response"
            TESTS_FAILED=$((TESTS_FAILED + 1))
        fi
    else
        echo -e "${GREEN}✓ PASSED${NC}"
        echo "Response: $(echo $response | jq -c '.' | head -c 100)..."
        TESTS_PASSED=$((TESTS_PASSED + 1))
    fi
    
    ((TEST_NUMBER++))
    echo ""
}

# ============================================
# TEST 1: Health Check
# ============================================
run_test "Health Check" \
    "curl -s -m $TIMEOUT '$API_URL/health'" \
    ".status"

# ============================================
# TEST 2: Authentication
# ============================================
AUTH_CMD="curl -s -m $TIMEOUT -X POST '$API_URL/auth/login' \
    -H 'Content-Type: application/json' \
    -d '{
        \"email\": \"admin@example.com\",
        \"password\": \"admin123\"
    }'"

echo -e "${YELLOW}[TEST $TEST_NUMBER]${NC} Authentication (Login)"
AUTH_RESPONSE=$(eval "$AUTH_CMD")

if echo "$AUTH_RESPONSE" | jq -e ".access_token" >/dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC}"
    JWT_TOKEN=$(echo "$AUTH_RESPONSE" | jq -r '.access_token')
    echo "Token obtained: ${JWT_TOKEN:0:50}..."
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ FAILED${NC} - No access_token in response"
    echo "Response: $AUTH_RESPONSE"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo -e "${RED}Cannot continue tests without authentication token${NC}"
    exit 1
fi
((TEST_NUMBER++))
echo ""

# Store JWT token for subsequent requests
AUTH_HEADER="-H 'Authorization: Bearer $JWT_TOKEN'"

# ============================================
# TEST 3: Get Programs
# ============================================
run_test "GET /programs" \
    "curl -s -m $TIMEOUT -X GET '$API_URL/programs' $AUTH_HEADER" \
    ".data"

# Extract first program ID
PROGRAM_CMD="curl -s -m $TIMEOUT -X GET '$API_URL/programs' $AUTH_HEADER"
PROGRAM_RESPONSE=$(eval "$PROGRAM_CMD")
PROGRAM_ID=$(echo "$PROGRAM_RESPONSE" | jq -r '.data[0].id')

if [ "$PROGRAM_ID" != "null" ] && [ -n "$PROGRAM_ID" ]; then
    echo -e "${GREEN}✓${NC} Using Program ID: $PROGRAM_ID"
else
    echo -e "${YELLOW}⚠${NC} No programs found, will use default"
    PROGRAM_ID="550e8400-e29b-41d4-a716-446655440010"
fi
echo ""

# ============================================
# TEST 4: Create POA Template
# ============================================
TEMPLATE_NAME="Plantilla Test $(date +%s)"
CREATE_TEMPLATE_CMD="curl -s -m $TIMEOUT -X POST '$API_URL/poa-templates' \
    $AUTH_HEADER \
    -H 'Content-Type: application/json' \
    -d '{
        \"name\": \"$TEMPLATE_NAME\",
        \"description\": \"Template for Sprint 3 testing\"
    }'"

echo -e "${YELLOW}[TEST $TEST_NUMBER]${NC} POST /poa-templates (Create Template)"
TEMPLATE_RESPONSE=$(eval "$CREATE_TEMPLATE_CMD")

if echo "$TEMPLATE_RESPONSE" | jq -e ".id" >/dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC}"
    TEMPLATE_ID=$(echo "$TEMPLATE_RESPONSE" | jq -r '.id')
    echo "Template ID: $TEMPLATE_ID"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ FAILED${NC} - Could not create template"
    echo "Response: $TEMPLATE_RESPONSE"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    TEMPLATE_ID="test-template-id"
fi
((TEST_NUMBER++))
echo ""

# ============================================
# TEST 5: Add Activity to Template
# ============================================
ADD_ACTIVITY_CMD="curl -s -m $TIMEOUT -X POST '$API_URL/poa-templates/$TEMPLATE_ID/activities' \
    $AUTH_HEADER \
    -H 'Content-Type: application/json' \
    -d '{
        \"name\": \"Beneficiarios atendidos\",
        \"description\": \"Número de personas beneficiadas\",
        \"meta\": 1000,
        \"unit\": \"personas\",
        \"programId\": \"$PROGRAM_ID\"
    }'"

echo -e "${YELLOW}[TEST $TEST_NUMBER]${NC} POST /poa-templates/:id/activities (Add Activity)"
ACTIVITY_RESPONSE=$(eval "$ADD_ACTIVITY_CMD")

if echo "$ACTIVITY_RESPONSE" | jq -e ".id" >/dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ACTIVITY_ID=$(echo "$ACTIVITY_RESPONSE" | jq -r '.id')
    echo "Activity ID: $ACTIVITY_ID"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ FAILED${NC} - Could not add activity"
    echo "Response: $ACTIVITY_RESPONSE"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    ACTIVITY_ID="test-activity-id"
fi
((TEST_NUMBER++))
echo ""

# ============================================
# TEST 6: Get Template Details
# ============================================
run_test "GET /poa-templates/:id (Get Template)" \
    "curl -s -m $TIMEOUT -X GET '$API_URL/poa-templates/$TEMPLATE_ID' $AUTH_HEADER" \
    ".id"

# ============================================
# TEST 7: Get Agreements
# ============================================
echo -e "${YELLOW}[TEST $TEST_NUMBER]${NC} GET /agreements"
AGREEMENTS_CMD="curl -s -m $TIMEOUT -X GET '$API_URL/agreements' $AUTH_HEADER"
AGREEMENTS_RESPONSE=$(eval "$AGREEMENTS_CMD")

if echo "$AGREEMENTS_RESPONSE" | jq -e ".data" >/dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC}"
    AGREEMENT_ID=$(echo "$AGREEMENTS_RESPONSE" | jq -r '.data[0].id')
    echo "Agreement ID: $AGREEMENT_ID"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ FAILED${NC} - Could not retrieve agreements"
    echo "Response: $AGREEMENTS_RESPONSE"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    AGREEMENT_ID="test-agreement-id"
fi
((TEST_NUMBER++))
echo ""

# ============================================
# TEST 8: Apply Template to Agreement (CRITICAL)
# ============================================
APPLY_TEMPLATE_CMD="curl -s -m $TIMEOUT -X POST '$API_URL/agreements/$AGREEMENT_ID/apply-template/$TEMPLATE_ID?year=2025' \
    $AUTH_HEADER \
    -H 'Content-Type: application/json' \
    -d '{}'"

echo -e "${YELLOW}[TEST $TEST_NUMBER]${NC} POST /agreements/:id/apply-template/:templateId (CRITICAL TEST)"
APPLY_RESPONSE=$(eval "$APPLY_TEMPLATE_CMD")

if echo "$APPLY_RESPONSE" | jq -e ".poaPeriod" >/dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC}"
    POA_ID=$(echo "$APPLY_RESPONSE" | jq -r '.poaPeriod.id')
    echo "POA Period ID: $POA_ID"
    echo "Activities created: $(echo $APPLY_RESPONSE | jq '.activities | length')"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ FAILED${NC} - Could not apply template"
    echo "Response: $APPLY_RESPONSE"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    POA_ID="test-poa-id"
fi
((TEST_NUMBER++))
echo ""

# ============================================
# TEST 9: Get Agreement Activities
# ============================================
run_test "GET /agreement-activities" \
    "curl -s -m $TIMEOUT -X GET '$API_URL/agreement-activities?poaPeriodId=$POA_ID' $AUTH_HEADER" \
    ".data"

# Extract activity ID for update test
ACTIVITIES_CMD="curl -s -m $TIMEOUT -X GET '$API_URL/agreement-activities?poaPeriodId=$POA_ID' $AUTH_HEADER"
ACTIVITIES_RESPONSE=$(eval "$ACTIVITIES_CMD")
CREATED_ACTIVITY_ID=$(echo "$ACTIVITIES_RESPONSE" | jq -r '.data[0].id')

echo ""

# ============================================
# TEST 10: Update Activity
# ============================================
UPDATE_ACTIVITY_CMD="curl -s -m $TIMEOUT -X PATCH '$API_URL/agreement-activities/$CREATED_ACTIVITY_ID' \
    $AUTH_HEADER \
    -H 'Content-Type: application/json' \
    -d '{
        \"progress\": 50,
        \"status\": \"IN_PROGRESS\"
    }'"

echo -e "${YELLOW}[TEST $TEST_NUMBER]${NC} PATCH /agreement-activities/:id (Update Activity)"
UPDATE_RESPONSE=$(eval "$UPDATE_ACTIVITY_CMD")

if echo "$UPDATE_RESPONSE" | jq -e ".id" >/dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC}"
    PROGRESS=$(echo "$UPDATE_RESPONSE" | jq -r '.progress')
    STATUS=$(echo "$UPDATE_RESPONSE" | jq -r '.status')
    echo "Updated - Progress: $PROGRESS, Status: $STATUS"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ FAILED${NC} - Could not update activity"
    echo "Response: $UPDATE_RESPONSE"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
((TEST_NUMBER++))
echo ""

# ============================================
# SUMMARY
# ============================================
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   📊 Test Summary${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
TOTAL=$((TESTS_PASSED + TESTS_FAILED))
echo -e "Total: $TOTAL"
echo ""

PASS_PERCENTAGE=$((TESTS_PASSED * 100 / TOTAL))
if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✨ ALL TESTS PASSED! (${PASS_PERCENTAGE}%)${NC}"
    echo -e "${GREEN}Sprint 3 implementation verified successfully!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠ Some tests failed. Please review the output above.${NC}"
    echo -e "${YELLOW}Pass rate: ${PASS_PERCENTAGE}%${NC}"
    exit 1
fi
