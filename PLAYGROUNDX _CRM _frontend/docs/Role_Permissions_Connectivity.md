# PlayGroundX CRM - User Roles, Permissions & Dashboard Architecture

## Overview

PlayGroundX CRM is an Enterprise AI Business Operating System designed to manage the complete lifecycle of Creators, Fans, Leads, Departments, AI Automation, Revenue, and Business Operations.

The system follows a strict **Role-Based Access Control (RBAC)** architecture where every user only has access to the data and modules required for their responsibilities.

The objective is to ensure:

* Secure data access
* Clean dashboard experience
* Department-wise operations
* AI-assisted workflows
* Enterprise-level scalability

---

# User Hierarchy

```
                    Super Admin
                         │
                         ▼
                 CEO / Executive
                         │
                         ▼
                Operations Manager
                         │
                         ▼
                 Team Supervisor
                         │
                         ▼
                    Sales Agent
                         │
                         ▼
                      Viewer

              AI System (Virtual Layer)
        Works with every role simultaneously
```

---

# Roles Overview

The system contains seven primary roles.

## 1. Super Admin

### Purpose

System Owner

### Responsibilities

* Complete platform management
* User & Role Management
* Department Management
* AI Configuration
* Automation Management
* Campaign Management
* Revenue Monitoring
* System Configuration
* Security & Permissions
* Integrations
* Workflow Builder
* Global Reports

### Access Level

Full Access

---

## 2. CEO / Executive

### Purpose

Business Analytics & Decision Making

### Responsibilities

* Monitor company growth
* Revenue monitoring
* Executive reporting
* Business KPIs
* Campaign performance
* AI performance
* Strategic decision making

### Access Level

Read Only

Cannot edit operational data.

---

## 3. Operations Manager

### Purpose

Manage overall business operations.

### Responsibilities

* Department management
* Queue management
* SLA monitoring
* Escalation management
* Team monitoring
* Workflow monitoring
* Operational reports

### Access Level

Operational Management

---

## 4. Team Supervisor

### Purpose

Manage one department or one language team.

Examples

* English Team
* Spanish Team
* Arabic Team
* French Team

### Responsibilities

* Monitor assigned agents
* Approve escalations
* Reassign leads
* Review conversations
* Team performance

### Access Level

Department Level

---

## 5. Sales Agent

### Purpose

Frontline communication with Creators and Fans.

### Responsibilities

* Handle assigned leads
* WhatsApp conversations
* Email communication
* Calls
* KYC follow-up
* Appointments
* Lead updates
* Daily tasks

### Access Level

Assigned Data Only

Agents should never access another agent's data unless ownership is transferred.

---

## 6. Viewer

### Purpose

Read-only reporting user.

Examples

* Investors
* Auditors
* Consultants

### Responsibilities

* View reports
* View analytics
* View dashboards

No editing permissions.

---

## 7. AI System (Virtual Role)

Unlike human users, AI works as an automated assistant across the platform.

Responsibilities include

* Welcome new users
* Lead qualification
* Lead scoring
* AI conversations
* WhatsApp automation
* Email automation
* Reminder automation
* Workflow execution
* Task generation
* Escalation detection
* VIP detection
* Opportunity creation
* Smart recommendations

The AI never replaces human users. It assists every department and automatically transfers conversations whenever human intervention is required.

---

# Workflow Architecture

The CRM follows this operational workflow.

```
Lead Generated
      │
      ▼

AI Qualification
      │
      ▼

Sales Agent
      │
      ▼

Team Supervisor
      │
      ▼

Operations Manager
      │
      ▼

Super Admin

Business Analytics

CEO / Executive
```

The AI layer operates continuously throughout the workflow by monitoring user activities, triggering automations, assigning tasks, and recommending next actions.

---

# Permission Strategy

Every role must have its own dashboard.

Every dashboard should display only the information required for that role.

The system should never expose unnecessary modules or operational data to higher or lower roles.

Permissions must be enforced through Role-Based Access Control (RBAC).

---

# Dashboard Strategy

Each role should have its own customized dashboard instead of sharing a single dashboard.

The dashboard should contain:

* Role-specific KPIs
* Role-specific widgets
* Role-specific charts
* Role-specific quick actions
* Role-specific navigation
* Role-specific notifications

Higher roles should see business insights and analytics.

Operational roles should see actionable tasks and daily work.

---

# Sidebar Strategy

The sidebar should dynamically change according to the logged-in user's role.

Menus must not be shared across all roles.

Each role should only see the modules relevant to its responsibilities.

---

# Frontend Development Note

This document defines the architecture only.

Role-wise dashboard widgets, KPIs, sidebar menus, permissions, charts, cards, tables, and page content should be implemented separately based on this architecture.

The frontend should remain modular so that every dashboard can reuse common UI components while displaying different data according to the authenticated user's role.
