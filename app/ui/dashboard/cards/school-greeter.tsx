/**
 * @since 2024-08-27
 * @author Gabriel
 */

import clsx from 'clsx';
import React, { Fragment, ReactElement } from 'react';
import { Card, CardHeader, Tooltip, Divider } from '@nextui-org/react';
import { Nunito } from 'next/font/google';
import { Capitalize } from '@/action/capitalize';
const nunito = Nunito({
  weight: ['200', '200'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

/**
 * Display one or more rows containing a title and one or more metrics, which contain a value and a label.
 * @param  title The title of the card.
 * @param  assessments The contents of a row. Contains name, values, labels, and tooltipText.
 */
export function SchoolGreeter({
  schoolId
}: {
  schoolId: number;
}): React.ReactElement {
  return (
    <Card className={`${nunito.className} items-center justify-center rounded-xl bg-neutral-50 pb-2`}>
      <CardHeader className="flex flex-col">

        <h3 className="text-lg font-large text-slate-800">Welcome to the MIDAS dashboard</h3>
        <h3 className="text-lg font-medium text-slate-800">Currently viewing School {schoolId}</h3>
      </CardHeader>

    </Card>
  );
}