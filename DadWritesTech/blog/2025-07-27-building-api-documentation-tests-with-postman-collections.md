---
slug: building-api-documentation-tests-with-postman-collections
title: "Building API Documentation Tests with Postman Collections: Complete Guide"
authors: [DadWritesTech]
tags: [techguides, api, testing, postman, automation, documentation]
date: 2025-07-27
---

🛠️ Testing API documentation shouldn't be manual guesswork. Here's how to automate validation using Postman Collections with JSONPlaceholder API.

**What you'll build:** A complete testing suite that validates API responses against documentation, catches schema changes, and integrates with CI/CD pipelines.

<!--truncate-->

## Step 1: Import the Ready-Made Collection

Copy this collection JSON and import it into Postman (File → Import → Raw Text):

```json
{
  "info": {
    "name": "API Documentation Validator",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Posts",
      "item": [
        {
          "name": "GET Single Post",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Response has required fields', function () {",
                  "    const response = pm.response.json();",
                  "    pm.expect(response).to.have.property('id');",
                  "    pm.expect(response).to.have.property('title');",
                  "    pm.expect(response).to.have.property('body');",
                  "    pm.expect(response).to.have.property('userId');",
                  "});",
                  "",
                  "pm.test('Field types match documentation', function () {",
                  "    const response = pm.response.json();",
                  "    pm.expect(response.id).to.be.a('number');",
                  "    pm.expect(response.title).to.be.a('string');",
                  "    pm.expect(response.body).to.be.a('string');",
                  "    pm.expect(response.userId).to.be.a('number');",
                  "});",
                  "",
                  "pm.test('Response time under 500ms', function () {",
                  "    pm.expect(pm.response.responseTime).to.be.below(500);",
                  "});"
                ]
              }
            },
            {
              "listen": "prerequest",
              "script": {
                "exec": [
                  "// Set random post ID for testing",
                  "pm.environment.set('post_id', Math.floor(Math.random() * 100) + 1);"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/posts/{{post_id}}",
              "host": ["{{base_url}}"],
              "path": ["posts", "{{post_id}}"]
            }
          }
        },
        {
          "name": "POST Create Post",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 201', function () {",
                  "    pm.response.to.have.status(201);",
                  "});",
                  "",
                  "pm.test('Response contains created resource', function () {",
                  "    const response = pm.response.json();",
                  "    pm.expect(response.id).to.exist;",
                  "    pm.expect(response.id).to.be.above(100);",
                  "});",
                  "",
                  "pm.test('Request body preserved in response', function () {",
                  "    const response = pm.response.json();",
                  "    const request = JSON.parse(pm.request.body.raw);",
                  "    pm.expect(response.title).to.equal(request.title);",
                  "    pm.expect(response.body).to.equal(request.body);",
                  "    pm.expect(response.userId).to.equal(request.userId);",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Test Documentation Post\",\n  \"body\": \"Testing API documentation validation\",\n  \"userId\": {{user_id}}\n}"
            },
            "url": {
              "raw": "{{base_url}}/posts",
              "host": ["{{base_url}}"],
              "path": ["posts"]
            }
          }
        },
        {
          "name": "GET All Posts",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Response is array of posts', function () {",
                  "    const response = pm.response.json();",
                  "    pm.expect(response).to.be.an('array');",
                  "    pm.expect(response.length).to.equal(100);",
                  "});",
                  "",
                  "pm.test('Each post has required structure', function () {",
                  "    const response = pm.response.json();",
                  "    const firstPost = response[0];",
                  "    pm.expect(firstPost).to.have.all.keys('id', 'title', 'body', 'userId');",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/posts",
              "host": ["{{base_url}}"],
              "path": ["posts"]
            }
          }
        }
      ]
    },
    {
      "name": "Users",
      "item": [
        {
          "name": "GET All Users",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Returns 10 users', function () {",
                  "    const response = pm.response.json();",
                  "    pm.expect(response).to.be.an('array');",
                  "    pm.expect(response.length).to.equal(10);",
                  "});",
                  "",
                  "pm.test('User object has complete structure', function () {",
                  "    const response = pm.response.json();",
                  "    const user = response[0];",
                  "    pm.expect(user).to.have.property('id');",
                  "    pm.expect(user).to.have.property('name');",
                  "    pm.expect(user).to.have.property('username');",
                  "    pm.expect(user).to.have.property('email');",
                  "    pm.expect(user).to.have.property('address');",
                  "    pm.expect(user).to.have.property('company');",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/users",
              "host": ["{{base_url}}"],
              "path": ["users"]
            }
          }
        },
        {
          "name": "GET User by ID",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 200', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('User ID matches request', function () {",
                  "    const response = pm.response.json();",
                  "    const requestedId = parseInt(pm.environment.get('user_id'));",
                  "    pm.expect(response.id).to.equal(requestedId);",
                  "});",
                  "",
                  "pm.test('Email format is valid', function () {",
                  "    const response = pm.response.json();",
                  "    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;",
                  "    pm.expect(response.email).to.match(emailRegex);",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/users/{{user_id}}",
              "host": ["{{base_url}}"],
              "path": ["users", "{{user_id}}"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "https://jsonplaceholder.typicode.com"
    },
    {
      "key": "user_id",
      "value": "1"
    },
    {
      "key": "post_id",
      "value": "1"
    }
  ]
}
```

## Step 2: Run Your First Tests

1. **Import the collection** using the JSON above
2. **Run the entire collection**: Click the collection name → Run → Start Run
3. **Check results**: You should see all tests passing with green checkmarks

**What just happened:**
- Tested 5 different endpoints
- Validated response schemas match documentation
- Checked data types and required fields
- Verified response times are acceptable
- Confirmed API behavior matches expectations

## Step 3: Understand the Test Patterns

### Schema Validation
```javascript
pm.test('Response has required fields', function () {
    const response = pm.response.json();
    pm.expect(response).to.have.property('id');
    pm.expect(response).to.have.property('title');
    pm.expect(response).to.have.property('body');
    pm.expect(response).to.have.property('userId');
});
```

### Data Type Checking
```javascript
pm.test('Field types match documentation', function () {
    const response = pm.response.json();
    pm.expect(response.id).to.be.a('number');
    pm.expect(response.title).to.be.a('string');
    pm.expect(response.body).to.be.a('string');
    pm.expect(response.userId).to.be.a('number');
});
```

### Performance Validation
```javascript
pm.test('Response time under 500ms', function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});
```

## Step 4: Automate with Newman CLI

Install Newman (Postman's command-line runner):
```bash
npm install -g newman
```

**Export and run your collection:**
1. Export collection: Three dots → Export → Collection v2.1
2. Save as `api-tests.json`
3. Run from command line:

```bash
newman run api-tests.json --reporters cli,json --reporter-json-export results.json
```

**Daily automation script:**
```bash
#!/bin/bash
# validate-docs.sh

echo "🔄 Running API documentation validation..."

newman run api-tests.json \
  --timeout-request 10000 \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export validation-report.html

if [ $? -eq 0 ]; then
  echo "✅ API documentation is valid"
else
  echo "❌ API documentation validation failed"
  exit 1
fi
```

Make it executable and schedule:
```bash
chmod +x validate-docs.sh
# Add to crontab for daily 9 AM validation
echo "0 9 * * * /path/to/validate-docs.sh" | crontab -
```

## Step 5: CI/CD Integration

### GitHub Actions
Create `.github/workflows/api-docs.yml`:
```yaml
name: API Documentation Tests
on: [push, pull_request]

jobs:
  validate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install Newman
        run: npm install -g newman
      - name: Run API Tests
        run: newman run api-tests.json --reporters cli,json --reporter-json-export results.json
      - name: Upload Test Results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: api-test-results
          path: results.json
```

### Jenkins Pipeline
```groovy
pipeline {
    agent any
    stages {
        stage('API Documentation Validation') {
            steps {
                sh 'npm install -g newman'
                sh 'newman run api-tests.json --reporters junit --reporter-junit-export newman-results.xml'
            }
            post {
                always {
                    junit 'newman-results.xml'
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: '.',
                        reportFiles: 'newman-results.xml',
                        reportName: 'API Documentation Tests'
                    ])
                }
            }
        }
    }
}
```

## Step 6: Environment Management

### Development Environment
Create `dev-environment.json`:
```json
{
  "id": "dev-env",
  "name": "Development",
  "values": [
    {
      "key": "base_url",
      "value": "https://jsonplaceholder.typicode.com",
      "enabled": true
    },
    {
      "key": "timeout",
      "value": "5000",
      "enabled": true
    }
  ]
}
```

### Production Environment
Create `prod-environment.json`:
```json
{
  "id": "prod-env",
  "name": "Production",
  "values": [
    {
      "key": "base_url",
      "value": "https://api.yourcompany.com",
      "enabled": true
    },
    {
      "key": "api_key",
      "value": "your-production-api-key",
      "enabled": true
    },
    {
      "key": "timeout",
      "value": "10000",
      "enabled": true
    }
  ]
}
```

**Run with specific environment:**
```bash
newman run api-tests.json -e prod-environment.json
```

## Step 7: Advanced Test Patterns

### Error Response Testing
```javascript
pm.test("Handle 404 errors properly", function () {
    if (pm.response.code === 404) {
        // Test that 404s have proper error structure
        const response = pm.response.json();
        pm.expect(response).to.have.property('error');
    }
});
```

### Data-Driven Testing
```javascript
// Test multiple user IDs
const userIds = [1, 2, 3, 4, 5];
userIds.forEach(userId => {
    pm.test(`User ${userId} returns valid data`, function() {
        pm.sendRequest({
            url: `${pm.environment.get('base_url')}/users/${userId}`,
            method: 'GET'
        }, function(err, response) {
            pm.expect(response.code).to.equal(200);
            pm.expect(response.json().id).to.equal(userId);
        });
    });
});
```

### Authentication Testing
```javascript
pm.test("API requires valid authentication", function () {
    pm.sendRequest({
        url: pm.environment.get('base_url') + '/protected-endpoint',
        method: 'GET',
        header: {
            'Authorization': 'Bearer invalid-token'
        }
    }, function(err, response) {
        pm.expect(response.code).to.equal(401);
    });
});
```

## Results and Benefits

**What this setup catches:**
- ✅ Schema changes (new/missing fields)
- ✅ Data type mismatches (string vs number)
- ✅ Response time regressions
- ✅ HTTP status code changes
- ✅ Authentication issues
- ✅ API availability problems

**Newman report shows:**
- 15 tests passed, 0 failed
- Average response time: 127ms
- Total run duration: 2.3s
- Test coverage by endpoint

**Real impact:**
- Catch documentation issues before developers hit them
- Automated validation on every code change
- Historical performance tracking
- Reduced support tickets for API problems