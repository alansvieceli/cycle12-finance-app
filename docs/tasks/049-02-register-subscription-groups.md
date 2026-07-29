# Task 049-02 - Register Subscription Groups in Cadastros

## Objective

Let the user assign a group to a subscription via tappable chips or free text,
and show the `Cadastros` list clustered under a header per group.

## Acceptance Criteria

- [x] The create form and each expanded subscription row show a chip per
      distinct tag already used elsewhere, plus a text field for typing a new
      one.
- [x] Tapping a chip fills the tag field; the chip whose label matches the
      current field value renders in its selected state.
- [x] The chip row renders nothing when no subscription has a tag yet.
- [x] The subscription list shows a header per group (colored dot, group
      name, group total masked by `valuesHidden`), ordered by group total
      descending, subscriptions within a group by amount descending.
- [x] Editing a subscription's amount or tag while its row is expanded does
      not reorder the list or move its header until the row closes.
- [x] A subscription created while another row is expanded appears under its
      own header at the end, without disturbing the frozen rows above it.
- [x] `npm run check` passes.
- [x] `npm run dup` passes.
