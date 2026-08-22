<?php
/**
 * Demo data layer for the static build.
 *
 * The live site is entirely database-driven and no SQL dump ships with this
 * source, so the static export is rendered against representative demo rows.
 * This file stands in for admin/include/MeecroDB.php during the build only —
 * it is never shipped in the static output.
 */

if (session_status() === PHP_SESSION_NONE) { session_start(); }
date_default_timezone_set('Asia/Kolkata');

define('RS', '&#8377;');
define('THISTIME', date('Y-m-d H:i:s'));
$thisdate = date('Y-m-d');
$thistime = date('Y-m-d H:i:s');
$toMail = 'info@deeprealestate.in';
$headers = '';
$headersadmin = '';

/* ------------------------------------------------------------------ data */

function demo_props() {
    $pics = ['PropertyID121.jpg','PropertyID122.jpg','PropertyID123.jpg','PropertyID128.jpg',
             'PropertyID129.jpg','PropertyID130.jpg','PropertyID131.jpg','PropertyID139.jpg',
             'PropertyID144.jpg','PropertyID148.jpg','PropertyID152.jpg','PropertyID158.jpg'];
    $names = [
        'The Camellias — 4 BHK Residence', 'M3M Golf Estate — 3 BHK', 'Independent Floor — Block S',
        'Corporate Suite — Cyber City', 'Retail Frontage — Sector 29', 'Residential Plot — Sector 57',
        'Vatika City — 3 BHK Apartment', 'Emaar Palm Gardens — 3 BHK', 'Ireo Victory Valley — 4 BHK',
        'Office Space — Udyog Vihar', 'Builder Floor — Sushant Lok', 'Showroom — Golf Course Road',
    ];
    $out = [];
    for ($i = 0; $i < 12; $i++) {
        $out[] = [
            'pid' => $i + 1,
            'pname' => $names[$i],
            'ptype' => ($i % 2 === 0) ? '2' : '1',
            'subtype' => (string)(1 + ($i % 3)),
            'purpose' => ($i % 3 === 0) ? 'for Sale' : 'for Rent',
            'pactive' => '1',
            'pimage_name' => $pics[$i],
            'price' => 5500 + ($i * 900),
            'psize' => 1200 + ($i * 240),
            'unit' => 'Sq.Ft.',
            'unit1' => 'Sq.Ft.',
            'did' => 1 + ($i % 4),
            'city' => 1,
            'location' => 1 + ($i % 4),
            'sublocation' => 'Block ' . chr(65 + $i),
            'movein' => 'Ready to move',
            'details' => 'A well-planned property in a established Gurgaon pocket, with power backup, '
                       . 'covered parking and round-the-clock security. Close to the expressway, schools '
                       . 'and daily-needs retail, with clear title and complete documentation.',
            'amenities' => 'Lift,Covered Parking,Power Backup,Security,Club House,Park',
            'contact_person' => 'Deep Kumar',
            'contact_no' => '+91 98109 22338',
        ];
    }
    return $out;
}

function demo_maps() {
    /* real files from admin/assets/maps — the sections mirror the ones the
       live site groups its maps into */
    $rows = [
        ['Gurgaon Master Plan',   'Gurgaon.jpeg'],
        ['DLF Phase 1',           'DLF_Phase_1.jpeg'],
        ['DLF Phase 2',           'DLF_Phase_2.jpeg'],
        ['DLF Phase 3',           'DLF_Phase_3.jpeg'],
        ['DLF Phase 4',           'DLF_Phase_4.jpeg'],
        ['Sushant Lok 1',         'Sushant_Lok_1.jpeg'],
        ['South City 2',          'South_City_2.jpeg'],
        ['Udyog Vihar',           'Udyog_Vihar_1_2_3_4_5.jpeg'],
    ];
    $out = [];
    foreach ($rows as $i => $r) {
        $out[] = ['mid' => $i + 1, 'map_name' => $r[0], 'thumb_url' => $r[1], 'map_url' => $r[1]];
    }
    return $out;
}

function demo_developers() {
    $rows = [
        ['did'=>1,'name'=>'DLF','logo'=>'dlf.jpg'],
        ['did'=>2,'name'=>'Emaar','logo'=>'emaar.jpg'],
        ['did'=>3,'name'=>'Unitech','logo'=>'unitech.jpg'],
        ['did'=>4,'name'=>'BPTP','logo'=>'bptp.png'],
        ['did'=>5,'name'=>'Bestech','logo'=>'bestech.jpg'],
        ['did'=>6,'name'=>'Parsvnath','logo'=>'parswanath.jpg'],
        ['did'=>7,'name'=>'Ansal API','logo'=>'ansal_api_logo.gif'],
        ['did'=>8,'name'=>'Central Park','logo'=>'central-park-logo1.jpg'],
    ];
    foreach ($rows as &$r) {
        $r['details'] = $r['name'] . ' is among the developers we deal with across Gurgaon. '
            . 'We handle resale and fresh inventory in their projects, and can arrange site visits '
            . 'and complete documentation support.';
    }
    return $rows;
}

/* dpath is relative to admin/assets/ — these files really are on disk, so the
   demo's download links resolve instead of 404ing. */
function demo_docs() {
    return [
        ['d_id'=>1,'dname'=>'Agreement To Sell','dcat'=>'Legal','dpath'=>'documents/AGREEMENTTOSELL.doc'],
        ['d_id'=>2,'dname'=>'Lease Deed','dcat'=>'Legal','dpath'=>'documents/LEASEDEED.doc'],
        ['d_id'=>3,'dname'=>'Gift Deed For Relative','dcat'=>'Legal','dpath'=>'documents/GIFTDEEDFORRELATIVE.doc'],
        ['d_id'=>4,'dname'=>'GPA For NRI','dcat'=>'Legal','dpath'=>'documents/GPAforNRI.doc'],
        ['d_id'=>5,'dname'=>'Form 60','dcat'=>'Forms','dpath'=>'documents/Form60.doc'],
        ['d_id'=>6,'dname'=>'Sample Sale Deed','dcat'=>'Reference','dpath'=>'documents/AAlok_Doc.pdf'],
    ];
}

/* ------------------------------------------------------------- DB facade */

class DB {
    public static $last = 0;

    public static function query($sql) {
        $rows = self::rowsFor(preg_replace('/\s+/', ' ', $sql));
        self::$last = count($rows);
        return $rows;
    }
    public static function count()        { return self::$last; }
    public static function affectedRows() { return self::$last; }
    public static function insertId()     { return 1; }

    private static function rowsFor($sql) {
        $has = function ($t) use ($sql) { return stripos($sql, $t) !== false; };

        if ($has('FROM banners')) {
            return [
                ['banner_path'=>'photo1.jpg','banner_position'=>1],
                ['banner_path'=>'photo3.jpg','banner_position'=>2],
                ['banner_path'=>'photo4.jpg','banner_position'=>3],
            ];
        }
        if ($has('propertyList')) {
            $rows = demo_props();
            if (preg_match("/pid\s*=\s*'?(\d+)/i", $sql, $m)) {
                $id = (int)$m[1];
                return array_values(array_filter($rows, fn($r) => $r['pid'] == $id));
            }
            if (preg_match("/ptype\s*=\s*'?(\d+)/i", $sql, $m)) {
                $t = $m[1];
                $rows = array_values(array_filter($rows, fn($r) => $r['ptype'] === $t));
            }
            if (preg_match("/location\s*=\s*'?(\d+)/i", $sql, $m)) {
                $l = (int)$m[1];
                $rows = array_values(array_filter($rows, fn($r) => $r['location'] == $l));
            }
            return $rows;
        }
        if ($has('FROM maps')) {
            $rows = demo_maps();
            if (preg_match("/mid\s*=\s*'?(\d+)/i", $sql, $m)) {
                $id = (int)$m[1];
                return array_values(array_filter($rows, fn($r) => $r['mid'] == $id));
            }
            return $rows;
        }
        if ($has('FROM developers')) {
            $rows = demo_developers();
            if (preg_match("/did\s*=\s*'?(\d+)/i", $sql, $m)) {
                $id = (int)$m[1];
                $hit = array_values(array_filter($rows, fn($r) => $r['did'] == $id));
                return $hit ?: [$rows[0]];
            }
            return $rows;
        }
        if ($has('FROM documents'))   { return demo_docs(); }
        if ($has('FROM testimonial')) {
            return [[
                'details' => 'They found us a home in DLF Phase 3 inside three weeks.',
                'showa'   => 'The paperwork was handled end to end without a single chase.',
                'name'    => 'A. Sharma', 'designation' => 'Homeowner, Gurgaon',
            ]];
        }
        if ($has('FROM menu')) {
            if (stripos($sql, "menu_cat='1'") !== false) {
                return [
                    ['menu_url'=>'About_Us.php','menu_name'=>'About Us'],
                    ['menu_url'=>'Developers.php','menu_name'=>'Developers'],
                    ['menu_url'=>'Contact_Us.php','menu_name'=>'Contact Us'],
                ];
            }
            return [
                ['menu_url'=>'FAQs.php','menu_name'=>'FAQs'],
                ['menu_url'=>'PrivacyPolicy.php','menu_name'=>'Privacy Policy'],
                ['menu_url'=>'TermsOfService.php','menu_name'=>'Terms of Service'],
            ];
        }
        if ($has('FROM cities'))       { return [['city_id'=>1,'cityName'=>'Gurgaon']]; }
        if ($has('FROM cityLocations')) {
            return [
                ['loc_id'=>1,'cityid'=>1,'locationName'=>'DLF Phase 3'],
                ['loc_id'=>2,'cityid'=>1,'locationName'=>'Sushant Lok'],
                ['loc_id'=>3,'cityid'=>1,'locationName'=>'Sector 57'],
                ['loc_id'=>4,'cityid'=>1,'locationName'=>'Golf Course Road'],
            ];
        }
        if ($has('FROM category')) {
            return [
                ['catid'=>1,'category'=>'Apartment','ptype'=>'2'],
                ['catid'=>2,'category'=>'Builder Floor','ptype'=>'2'],
                ['catid'=>3,'category'=>'Office Space','ptype'=>'1'],
            ];
        }
        if ($has('FROM catp')) {
            return [['cp_id'=>1,'cp_name'=>'Commercial'],['cp_id'=>2,'cp_name'=>'Residential']];
        }
        if ($has('FROM units')) {
            return [['u_id'=>1,'u_units'=>'Sq.Ft.'],['u_id'=>2,'u_units'=>'Sq.Yd.'],['u_id'=>3,'u_units'=>'Acre']];
        }
        if ($has('FROM amenities')) {
            $out = [];
            foreach (['Lift','Covered Parking','Power Backup','Security','Club House','Park','Gym','Swimming Pool'] as $i => $a) {
                $out[] = ['a_id'=>$i+1,'amenity'=>$a,'a_name'=>$a];
            }
            return $out;
        }
        return [];
    }
}

/* --------------------------------------------------------- site settings */

$uz = $admin = [
    'CompanyName'=>'Deep Real Estate','Logo'=>'DeepLogo1.png','ThirdLogo'=>'DeepLogo3.png',
    'SecondLogo'=>'DeepLogo2.png','Slogan'=>'Lighting Dreams',
    'Address'=>'G-564, Sushant Lok-II Extn. ','Address2'=>'Sector 57, Nr. Scottish High, ',
    'City'=>'Gurgaon','State'=>'Haryana','Pin'=>'122002','Country'=>'India',
    'Phone1'=>'0124-4080100','Phone2'=>'','Mobile1'=>'+91-9810922338','Mobile2'=>'',
    'Email1'=>'info@deeprealestate.in','Email2'=>'','OwnerName'=>'Deep Kumar',
    /* path is relative to admin/ — a neutral stand-in, since the real
       owner photograph is not part of this demo data set */
    'OwnerPic'=>'assets/images/agent-placeholder.jpg',
    'facebook'=>'https://www.facebook.com/','twitter'=>'','linkdin'=>'',
    'youtube'=>'','instag'=>'https://www.instagram.com/',
];

/* ------------------------------------------------------- helper functions */

function getPrice($u) {
    $u = round($u, 0); $g = 'Call for Price'; $len = strlen((string)$u);
    if ($len == 4)      { $g = '&#8377 '.round($u/1000, 2).' Thousand'; }
    elseif ($len == 5)  { $g = '&#8377 '.round($u/1000, 2).' Thousand'; }
    elseif ($len == 6)  { $g = '&#8377 '.round($u/100000, 2).' Lac'; }
    elseif ($len == 7)  { $g = '&#8377 '.round($u/100000, 2).' Lac'; }
    elseif ($len == 8)  { $g = '&#8377 '.round($u/10000000, 2).' Cr.'; }
    elseif ($len >= 9)  { $g = '&#8377 '.round($u/10000000, 2).' Cr.'; }
    return $g;
}
function cityName($u)     { $r = DB::query("SELECT * FROM cities WHERE city_id='$u'"); return $r[0]['cityName'] ?? 'Gurgaon'; }
function locationName($u) {
    foreach (DB::query('SELECT * FROM cityLocations') as $r) { if ($r['loc_id'] == $u) return $r['locationName']; }
    return 'Gurgaon';
}
function developerInfo($u, $v) {
    foreach (DB::query('SELECT * FROM developers') as $r) { if ($r['did'] == $u) return $r[$v] ?? ''; }
    return '';
}
function categoryName($u) { foreach (DB::query('SELECT * FROM category') as $r) { if ($r['catid'] == $u) return $r['category']; } return 'Apartment'; }
function typeName($u)     { foreach (DB::query('SELECT * FROM catp') as $r) { if ($r['cp_id'] == $u) return $r['cp_name']; } return 'Residential'; }
function limit_text($t, $l) { $w = explode(' ', trim($t)); return count($w) > $l ? implode(' ', array_slice($w, 0, $l)) : $t; }

/* News is fetched live over cURL on the real site; the static build ships a
   fixed set so the export is deterministic and needs no network. */
function get_content($URL) {
    $items = '';
    $heads = [
        'Housing sales in NCR rise on steady end-user demand',
        'Gurgaon leads office leasing across the Delhi-NCR belt',
        'New expressway link lifts sentiment along the southern periphery',
        'Developers line up fresh launches on Golf Course Extension',
        'Plotted development returns to favour with investors',
        'Retail rentals firm up in prime Gurgaon high streets',
        'Rental yields hold steady across established sectors',
    ];
    foreach ($heads as $i => $h) {
        $items .= '<item><title>'.$h.'</title>'
                . '<link>#</link>'
                . '<image src="assets/images/blog-list.jpg"/></item>';
    }
    return '<?xml version="1.0"?><rss><channel>'.$items.'</channel></rss>';
}

function getPropertyTypes($u)          { $f=''; foreach (DB::query("SELECT * FROM category WHERE ptype='$u'") as $t) { $f .= "<option value='{$t['catid']}'>{$t['category']}</option>"; } return $f; }
function getSelectedPropertyTypes($u,$v){ return getPropertyTypes($u); }
function getCityList()                 { $f=''; foreach (DB::query('SELECT * FROM cities') as $t) { $f .= "<option value='{$t['city_id']}'>{$t['cityName']}</option>"; } return $f; }
function getSelectedCityList($u)       { return getCityList(); }
function getLocationList($u)           { $f=''; foreach (DB::query('SELECT * FROM cityLocations') as $t) { $f .= "<option value='{$t['loc_id']}'>{$t['locationName']}</option>"; } return $f; }
function getSelectedLocationList($u,$v){ return getLocationList($u); }
function getDevelopetrsList()          { $f=''; foreach (DB::query('SELECT * FROM developers') as $t) { $f .= "<option value='{$t['did']}'>{$t['name']}</option>"; } return $f; }
function getSelectedDevelopetrsList($u){ return getDevelopetrsList(); }
function getUnitList()                 { $f=''; foreach (DB::query('SELECT * FROM units') as $t) { $f .= "<option value='{$t['u_units']}'>{$t['u_units']}</option>"; } return $f; }
function getSelectedUnitList($u)       { return getUnitList(); }
function getPTypeList()                { $f=''; foreach (DB::query('SELECT * FROM catp') as $t) { $f .= "<option value='{$t['cp_id']}'>{$t['cp_name']}</option>"; } return $f; }
function getSelectedPTypeList($u)      { return getPTypeList(); }
function getRights($email)             { return 'all'; }
function randomDate()                  { return date('Y-m-d'); }
