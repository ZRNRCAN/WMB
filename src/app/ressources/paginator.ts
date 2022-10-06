import { MatPaginatorIntl } from '@angular/material/paginator';

let paginatorText: any = {
  'en-CA': {
    items: 'Items per page:',
    next: 'Next Page',
    last: 'Last Page', 
    first: 'First Page',
    previous: 'Previous Page',
    of: 'of'
  },
  'fr-CA': {
    items: 'Résultats par page',
    next: 'Page suivante',
    last: 'Dernière page', 
    first: 'Première page',
    previous: 'Page précédente',
    of: 'de'
  }
}

let currentLang: string = document.documentElement.lang;
let langTextElem = paginatorText[currentLang];

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();
  customPaginatorIntl.itemsPerPageLabel = langTextElem.items;
  customPaginatorIntl.nextPageLabel = langTextElem.next;
  customPaginatorIntl.lastPageLabel = langTextElem.last;
  customPaginatorIntl.firstPageLabel = langTextElem.first;
  customPaginatorIntl.previousPageLabel = langTextElem.previous;

  customPaginatorIntl.getRangeLabel = (page, pageSize, length) => {
    if (length == 0 || pageSize == 0) {
        return `0 of ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} – ${endIndex} ${langTextElem.of} ${length}`;
  };
  
  return customPaginatorIntl;
}
