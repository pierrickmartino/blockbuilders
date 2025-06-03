import React from "react";
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, ListItemButton, Badge } from "@mui/material";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";

const contacts = [
  {
    img: "/images/users/1.jpg",
    title: "Oliver Jake",
    subtext: "info@oliver.com",
    status: "primary.main",
  },
  {
    img: "/images/users/2.jpg",
    title: "Jack Connor",
    subtext: "info@jack.com",
    status: "secondary.main",
  },
  {
    img: "/images/users/3.jpg",
    title: "Harry Callum",
    subtext: "info@harry.com",
    status: "error.main",
  },
  {
    img: "/images/users/4.jpg",
    title: "Jacob Reece",
    subtext: "info@jacob.com",
    status: "warning.main",
  },
];

const MyContacts = () => {
  return (
    <>
      <Card>
        <Box px={3} py={2} bgcolor="primary.main" color="white" borderRadius="0 !important" mb="-15px">
          <Heading variant="h5">My Contacts</Heading>
          <Heading variant="subtitle">Checkout my contacts here</Heading>
        </Box>
        <Box pt={2}>
          <List>
            {contacts.map((contact, i) => (
              <ListItem key={i}>
                <ListItemButton>
                  <ListItemAvatar>
                    <Badge
                      variant="dot"
                      sx={{
                        ".MuiBadge-badge": {
                          backgroundColor: contact.status,
                        },
                      }}
                    >
                      <Avatar src={contact.img} alt="1" />
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={contact.title}
                    primaryTypographyProps={{
                      fontSize: "16px",
                      fontWeight: 500,
                    }}
                    secondary={contact.subtext}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Card>
    </>
  );
};

export default MyContacts;
