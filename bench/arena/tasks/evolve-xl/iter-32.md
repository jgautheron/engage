# Change request — report

`report(today: string): { todo: number; done: number; overdue: number; dueToday: number }` counts
every task that is not archived (subtasks included): `overdue` = not done and due before `today`;
`dueToday` = not done and due on `today`. An invalid date throws "invalid date".

All existing behaviour stays as is.
