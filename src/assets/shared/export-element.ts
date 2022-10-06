
export const exportToCsv2 = (filename: string, rows: object[], headers?: string[]): void => {
    if (!rows || !rows.length) {
        return;
    }

    const separator: string = ",";
    const keys: string[]  = Object.keys(rows[0]);
    let columHearders: string[];

    if (headers) {
      columHearders = headers;
    }
    else {
      columHearders = keys;
    }

    const csvContent =
      "sep=,\n" +
      columHearders.join(separator) +
      '\n' +
      rows.map((row: any) => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];

          cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');

          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
}

export function exportToCsv(filename: string, rows: object[], headers: string[]): void {
  if (!rows || !rows.length) {
    return;
  }

  const separator: string = ",";
  const columHearders: string[] = headers;
  const keys: string[] = Object.keys(rows[0]);

  const csvContent = columHearders.join(separator) + '\n' + rows.map((row: any) => {
    return keys.map(k => {
      let cell = row[k] === null || row[k] === undefined ? '' : row[k];
  
      cell = cell instanceof Number ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');

      if (cell.search(/("|,|\n)/g) >= 0) {
        cell = cell.replace(/(\r\n|\n|\r)/gm, " ");
        cell = `"${cell}"`;
      }

      if (cell.search(';') >= 0) {
        cell = cell.replace(/;/g, ",");
      }

      while (cell.search(/(&amp,)/) >= 0) {
        cell = cell.replace('&amp,', '&');
        cell = cell.replace('&amp;', '&');
      }

      return cell;
    }).join(separator);
  }).join('\n');

  const link = document.createElement('a');

  if (link.download !== undefined) {
    link.setAttribute('href', 'data:text/csv; charset=utf-8,'+ "\uFEFF" + encodeURIComponent("\uFEFF" + csvContent));
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
