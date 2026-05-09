export const standardizedLevel = (level) => {
    const normalizedLevel = level.trim().toLowerCase().replace(/[-_]/g, " ");
    const LEVEL_MAP = {
        Junior: [
            "l1",
            "l2",
            "l3",
            "e1",
            "e2",
            "sde1",
            "junior engineer",
            "junior developer",
            "associate",
            "fresher",
            "trainee",
        ],
        Mid: [
            "l4",
            "l5",
            "e3",
            "sde2",
            "sde3",
            "mid engineer",
            "mid level developer",
            "mid developer",
            "software engineer 2",
        ],
        Senior: [
            "l6",
            "l7",
            "l8",
            "e4",
            "e5",
            "sde4",
            "senior engineer",
            "senior developer",
            "lead",
        ],
        Staff: [
            "l9",
            "l10",
            "e6",
            "e7",
            "sde5",
            "sde6",
            "principal engineer",
            "principal developer",
            "staff engineer",
            "staff developer",
            "architect",
            "distinguished",
        ],
    };
    for (const [standardLevel, aliases] of Object.entries(LEVEL_MAP)) {
        const match = aliases.some((alias) => normalizedLevel.includes(alias));
        if (match)
            return standardLevel;
    }
    return "Unknown";
};
//# sourceMappingURL=level.util.js.map