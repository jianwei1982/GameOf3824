# Tasks: 24点计算网页游戏

**Input**: Design documents from `specs/001-24game/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: 根据宪法要求，需包含单元测试

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project directory structure per plan.md (css/, js/, tests/, assets/)
- [X] T002 Create index.html with basic HTML structure
- [X] T003 [P] Create css/style.css with CSS variables and base styles

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Configure Vitest testing framework in package.json
- [X] T005 [P] Create css/variables.css with design tokens (colors, typography, spacing)
- [X] T006 Create js/utils/expression-evaluator.js with infix-to-postfix and evaluation
- [X] T007 Create js/utils/solver-24.js with穷举法无解检测算法 in js/utils/solver-24.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 经典模式完成一道24点题 (Priority: P1) 🎯 MVP

**Goal**: 儿童玩家在经典模式中，看到4张数字卡片，用运算符卡片拼成正确算式得出24点

**Independent Test**: 输入4张卡片 [3,8,3,8]，玩家算式 "8÷(3-8÷3)"，验证结果是否等于24并返回正确反馈

### Implementation for User Story 1

- [X] T008 [P] [US1] Create NumberCard class in js/components/NumberCard.js
- [X] T009 [P] [US1] Create OperatorCard class in js/components/OperatorCard.js
- [X] T010 [US1] Create CardSet class for generating 4 random cards in js/components/CardSet.js (depends on T008)
- [X] T011 [US1] Create Formula class for building and validating player expressions in js/components/Formula.js (depends on T006)
- [X] T012 [US1] Create GameState class for managing game mode, score, stars in js/core/GameState.js
- [X] T013 [US1] Implement card display and selection UI in js/ui/CardDisplay.js (depends on T008, T009)
- [X] T014 [US1] Implement operator selection UI in js/ui/OperatorPanel.js (depends on T009)
- [X] T015 [US1] Implement formula builder UI in js/ui/FormulaBuilder.js (depends on T011)
- [X] T016 [US1] Implement answer validation with star rating in js/core/GameEngine.js (depends on T010, T011, T012)
- [X] T017 [US1] Implement feedback system (animation + sound + text) in js/ui/FeedbackSystem.js
- [X] T018 [US1] Implement "换牌" and "宣布无解" functionality in js/ui/ActionButtons.js (depends on T010, T007)
- [X] T019 [US1] Create main game page UI in index.html integration (depends on T013-T018)

### Tests for User Story 1

- [ ] T020 [P] [US1] Unit test for expression-evaluator in tests/unit/expression-evaluator.test.js
- [ ] T021 [P] [US1] Unit test for solver-24 in tests/unit/solver-24.test.js
- [ ] T022 [P] [US1] Unit test for CardSet generation in tests/unit/CardSet.test.js
- [ ] T023 [P] [US1] Unit test for Formula validation in tests/unit/Formula.test.js
- [ ] T024 [US1] Integration test for classic mode gameplay in tests/integration/classic-mode.test.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - 竞速模式挑战 (Priority: P2)

**Goal**: 儿童玩家在竞速模式中，60秒内尽可能多地解答24点题目

**Independent Test**: 启动60秒倒计时，验证计时、计分和游戏结束逻辑

### Implementation for User Story 2

- [ ] T025 [P] [US2] Create Timer class for countdown in js/core/Timer.js
- [ ] T026 [US2] Implement time-based scoring algorithm in js/core/ScoreCalculator.js
- [ ] T027 [US2] Add speed mode UI in index.html (timer display, score)
- [ ] T028 [US2] Integrate timer with game flow in js/core/GameEngine.js (depends on T025)
- [ ] T029 [US2] Implement game over screen with final score in js/ui/GameOverScreen.js
- [ ] T030 [P] [US2] Add unit test for Timer in tests/unit/Timer.test.js

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - 提示系统使用 (Priority: P3)

**Goal**: 玩家遇到困难时使用提示功能，每局限制使用3次

**Independent Test**: 点击提示按钮3次，验证第3次后提示按钮被禁用

### Implementation for User Story 3

- [ ] T031 [P] [US3] Create HintGenerator class in js/core/HintGenerator.js
- [ ] T032 [US3] Implement hint button UI in js/ui/HintButton.js
- [ ] T033 [US3] Integrate hint system with GameState (hintsRemaining tracking) in js/core/GameEngine.js (depends on T012)
- [ ] T034 [US3] Add hint button to main game UI in index.html
- [ ] T035 [P] [US3] Unit test for HintGenerator in tests/unit/HintGenerator.test.js

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T036 [P] Add sound effect files to assets/sounds/ (correct, wrong, click, win)
- [ ] T037 [P] Add visual assets (card back, icons) to assets/images/
- [ ] T038 Add CSS animations for card flip, correct/wrong feedback in css/animations.css
- [ ] T039 Responsive layout adjustments for mobile in css/responsive.css
- [ ] T040 Final integration test across all user stories in tests/integration/full-game.test.js
- [ ] T041 Run quickstart.md validation and fix any issues

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Uses US1 game engine
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Uses US1 game engine

### Within Each User Story

- Core logic (utils) before components
- Components before UI
- UI before integration
- Tests before or parallel to implementation

### Parallel Opportunities

- T001, T002, T003 can run in parallel
- T004, T005, T006, T007 can run in parallel
- T008, T009 can run in parallel
- T020, T021, T022, T023 can run in parallel
- T025, T026 can run in parallel
- T030, T031, T035 can run in parallel (if dependencies ready)

---

## Parallel Example: User Story 1

```bash
# Launch all unit tests for foundational utils together:
Task: "Unit test for expression-evaluator in tests/unit/expression-evaluator.test.js"
Task: "Unit test for solver-24 in tests/unit/solver-24.test.js"

# Launch all component classes together:
Task: "Create NumberCard class in js/components/NumberCard.js"
Task: "Create OperatorCard class in js/components/OperatorCard.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence