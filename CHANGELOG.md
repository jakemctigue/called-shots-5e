# Changelog

## [1.1.0] - 2026-06-30

### Added
- **Instant Kill (−12)** option for called shots targeting vital areas
- **Description label** in the attack dialog showing `Called Shots - <size>` when a called shot is selected

### Fixed
- Resolved re-render cascade that caused the penalty to stack multiple times
- Correctly targets the `roll.0.situational` field for dnd5e 5.x compatibility

## [1.0.0] - 2026-06-30

### Added
- Initial release
- Called Shot dropdown injected into the dnd5e attack roll dialog
- Medium (−3), Small (−6), and Tiny (−9) target size options
- Penalty applied via the situational bonus field
- Foundry v13 / dnd5e 5.3.3 compatibility
