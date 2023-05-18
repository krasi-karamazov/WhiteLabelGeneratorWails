import { useState } from 'react';
import {createStyles, Header, Container, Group, rem, ActionIcon, Text, Paper, Flex, Button} from '@mantine/core';
import {IconFileZip} from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    links: {
        [theme.fn.smallerThan('xs')]: {
            display: 'none',
        },
    },

    burger: {
        [theme.fn.largerThan('xs')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: `${rem(8)} ${rem(12)}`,
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
            color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        },
    },
}));

interface WhiteLabelHeaderProps {
    links: { link: number; label: string }[];
    onNavigate: (nav: number) => void
    onSave:()=> void
}

export enum NavigationOption {
    AppProperties = 0,
    Colors = 1,
    Misc = 2
}

export function WhiteLabelHeader({ links, onNavigate, onSave}: WhiteLabelHeaderProps) {
    const [active, setActive] = useState(links[0].link);
    const { classes, cx } = useStyles();

    const items = links.map((link) => (
        <a
            key={link.label}
            href={link.link.toString()}
            className={cx(classes.link, { [classes.linkActive]: active === link.link })}
            onClick={(event) => {
                event.preventDefault();
                setActive(link.link);
                onNavigate(link.link)
            }}
        >
            {link.label}
        </a>
    ));

    return (
        <Header height={40} mb={16}>
            <Container className={classes.header}>
                <Button leftIcon={<IconFileZip size="1.125rem"/>} variant="subtle" onClick={onSave}>
                    Save
                </Button>

                <Group spacing={5} className={classes.links}>
                    {items}
                </Group>

            </Container>
        </Header>
    );
}