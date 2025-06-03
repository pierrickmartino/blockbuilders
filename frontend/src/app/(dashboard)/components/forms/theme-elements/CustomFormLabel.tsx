import React from 'react';
import { styled } from '@mui/material/styles';
import { Heading } from '@/components/Heading';

const CustomFormLabel = styled((props: any) => (
  <Heading
    variant="subtitle1"
    fontWeight={500}
    {...props}
    component="label"
    htmlFor={props.htmlFor}
  />
))(() => ({
  marginBottom: '5px',
  marginTop: '25px',
  display: 'block',
}));

export default CustomFormLabel;
