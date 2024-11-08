import { List, ListItem, ListItemText, TextField } from "@mui/material";
import { styled } from "@mui/system";
import { Texts } from "../../index";

interface LanguageTextListProps {
  texts: Texts;
  isEditing: boolean;
  onChange?: (lang: string, value: string) => void;
}

const StyledList = styled(List)({
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "10px",
  backgroundColor: "#f9f9f9",
});

const StyledListItem = styled(ListItem)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #ddd",
  "&:last-child": {
    borderBottom: "none",
  },
});

const languageOrder = ["en", "uk", "ru", "gr"]; // Фіксований порядок мов

export const LanguageTextList = ({
  texts,
  isEditing,
  onChange,
}: LanguageTextListProps) => {
  return (
    <StyledList>
      {languageOrder.map((lang) => {
        const aliasLang = lang === "uk" ? "ua" : lang;
        return (
          <StyledListItem key={lang}>
            {isEditing ? (
              <TextField
                label={`Text (${aliasLang.toUpperCase()})`}
                value={texts[lang as keyof Texts]}
                onChange={(e) => onChange?.(lang, e.target.value)}
                fullWidth
                margin="normal"
              />
            ) : (
              <ListItemText
                primary={<strong>{aliasLang.toUpperCase()}</strong>}
                secondary={texts[lang as keyof Texts] || "No text provided"}
                sx={{ marginRight: "20px" }}
              />
            )}
          </StyledListItem>
        );
      })}
    </StyledList>
  );
};
