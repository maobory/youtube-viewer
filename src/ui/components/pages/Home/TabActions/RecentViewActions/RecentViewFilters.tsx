import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { StyledMenu, CheckableMenuItem } from 'ui/components/shared';
import { useAppDispatch, useAppSelector } from 'store';
import FilterListIcon from '@mui/icons-material/FilterList';
import { selectViewFilters } from 'store/selectors/settings';
import { setViewFilters } from 'store/reducers/settings';
import { HomeView, Nullable, RecentViewFilters as Filters } from 'types';

interface RecentViewFiltersProps {}

function RecentViewFilters(props: RecentViewFiltersProps) {
  const filters = useAppSelector(selectViewFilters(HomeView.Recent));
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterToggle = (key: keyof Filters) => {
    dispatch(
      setViewFilters({
        view: HomeView.Recent,
        filters: {
          [key]: !filters[key],
        },
      }),
    );
  };

  return (
    <>
      <IconButton
        id="filter-button"
        aria-label="filter"
        aria-controls={open ? 'filter-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <FilterListIcon />
      </IconButton>
      <StyledMenu
        id="filter-menu"
        MenuListProps={{
          'aria-labelledby': 'filter-button',
          dense: true,
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <CheckableMenuItem
          checked={filters.viewed}
          onClick={() => handleFilterToggle('viewed')}
        >
          Viewed
        </CheckableMenuItem>
        <CheckableMenuItem
          checked={filters.watchLater!}
          onClick={() => handleFilterToggle('watchLater')}
        >
          Watch later
        </CheckableMenuItem>
        <CheckableMenuItem
          checked={filters.others}
          onClick={() => handleFilterToggle('others')}
        >
          Others
        </CheckableMenuItem>
      </StyledMenu>
    </>
  );
}

export default RecentViewFilters;
