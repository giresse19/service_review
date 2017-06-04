import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';

autocomplete( $('#address'), $('#lat'), $('#lng') );



typeAhead( $(' .search'));

// selecting with document.querySelector as in jQuery