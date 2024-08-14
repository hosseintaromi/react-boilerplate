import { Box, Button, InputAdornment, Stack, Toolbar } from "@mui/material";
import { FilterPopup, FilterPopupProps } from "@components/FilterPopup";
import { memo, ReactNode } from "react";
import { FormElements } from "@components/forms/FormElements";
import SearchIcon from '@mui/icons-material/SearchOutlined';

interface TableHeaderProps {
  filter?: FilterPopupProps;
  search?: {
    onSubmit: (value: string) => any;
    placeholder?: string;
  };
  actions?: ReactNode;
}

export const TableHeader = memo((props: TableHeaderProps) => {
  const {filter, search, actions} = props;

  return (
      <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
        {
            search &&
            <FormElements.Container onSuccess={(v) => search.onSubmit(v.search)}>
              <Stack direction="row" spacing={1}>
                <FormElements.TextField
                    size="small"
                    placeholder={search.placeholder || 'جستجو...'}
                    name="search"
                    InputProps={{
                      startAdornment:
                          <InputAdornment position="start">
                            <SearchIcon/>
                          </InputAdornment>
                    }}/>
                <Button size="small" type="submit" variant="outlined">جستجو</Button>
              </Stack>
            </FormElements.Container>
        }
        <Box>
          {actions}
          {
              filter &&
              <FilterPopup {...filter} />
          }
        </Box>
      </Toolbar>
  )
})
