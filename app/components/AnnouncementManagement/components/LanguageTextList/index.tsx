import { StyledListItem } from "@/app/components/TurnOffTheDay/components/DateList/styled";
import { ListItemText, TextField } from "@mui/material";
import { Texts } from "../../index";
import { StyledList } from "./styled";

interface LanguageTextListProps {
  texts: Texts;
  isEditing: boolean;
  onChange?: (lang: string, value: string) => void;
}

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
