var isRNFLMarkdown = false;

function getParam(a) {
    var d = location.search.substr(location.search.indexOf("?") + 1),
        c = "", b; d = d.split("&"); for (b = 0; b < d.length; b++) {
        temp = d[b].split("="); if ([temp[0]] == a) { c = temp[1] }
        }
        return c
}
function setCookie(a, d, b) {
    var e = new Date(), c; e.setDate(e.getDate() + b); c = escape(d) + ((b == null) ? "" : "; expires=" + e.toUTCString());
    document.cookie = a + "=" + c
}
function set_game_cookie(c, a) {
    var b = "-" + c.join("") + "_"; a = (a == undefined) ? false : a;
    if (!a) {
        setCookie(games_cookie_name, b, 999)
    } set_visible_cookie(b)
}
function set_visible_cookie(a) {
    document.getElementById("save_string").innerHTML = "http://0003mg.github.io/nflschedulepicker/?a=" + a
}
function getCookie(b) {
    var c, a, e, d = document.cookie.split(";");
    for (c = 0; c < d.length; c++) {
        a = d[c].substr(0, d[c].indexOf("="));
        e = d[c].substr(d[c].indexOf("=") + 1);
        a = a.replace(/^\s+|\s+$/g, "");
        if (a == b) {
            return unescape(e);
        }
    }
}
var conferenceRankingObject = {};
var games_cookie_name = "NFL Custom",
    cookie_letter_length = 86,
    cookie64_re = /-[A-Za-z0-9\-_]{86}_?/,
    base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
    number_of_weeks = 21,
    week_lists = [
        /*1*/["ARI-DAL", "STL-SEA", "DEN-TB", "GB-ATL", "MIA-PIT", "NYG-CLE", "NYJ-NE", "OAK-KC", "TEN-JAC", "WSH-BAL", "SF-PHI", "NO-CAR", "DET-CHI", "HOU-MIN", "IND-SD", "BUF-CIN"],
        /*2*/["BAL-PIT", "TEN-NYJ", "ATL-DEN", "CAR-SF", "TB-STL", "SEA-GB", "CHI-HOU", "SD-OAK", "CIN-MIA", "PHI-NYG", "CLE-WAS", "NE-ARI", "DAL-NO", "MIN-DET", "IND-BUF", "KC-JAC"],
        /*3*/["TB-SD", "SEA-SF", "PIT-NYJ", "PHI-ATL", "NYG-WAS", "MIA-CLE", "STL-MIN", "KC-TEN", "JAC-OAK", "HOU-NE", "GB-CAR", "DET-IND", "DEN-NO", "CIN-DAL", "BUF-BAL", "ARI-CHI"],
        /*4*/["JAC-HOU", "IND-KC", "MIA-SEA", "DET-NYG", "DAL-PHI", "MIN-CHI", "NO-TB", "CLE-CIN", "NYJ-BUF", "CAR-ATL", "OAK-DEN", "BAL-TEN", "SD-PIT", "SF-NE", "ARI-STL"],
        /*5*/["ATL-ARI", "BAL-NYG", "CHI-TB", "DAL-CLE", "DEN-IND", "HOU-GB", "STL-MIA", "MIN-JAC", "NE-BUF", "NO-SD", "NYJ-OAK", "PHI-SEA", "PIT-WAS", "SF-DET"],
        /*6*/["WSH-SEA", "ARI-NYJ", "TEN-CHI", "ATL-NO", "TB-KC", "BUF-SF", "CAR-DEN", "PIT-PHI", "CIN-HOU", "STL-NE", "CLE-IND", "JAC-MIA", "DET-MIN", "GB-DAL"],
        /*7*/["MIN-WAS", "IND-JAC", "GB-DET", "DAL-STL", "CIN-BAL", "CHI-PHI", "PIT-BUF", "NYJ-MIA", "NYG-CAR", "TEN-OAK" "SEA-ARI", "SD-KC"],
        /*8*/["STL-PHI", "WAS-DAL", "IND-GB", "KC-CLE", "CAR-TB", "ARI-BUF", "NO-MIN", "NYG-PIT", "OAK-BAL", "NYJ-CIN", "SF-SEA", "MIA-NE"],
        /*9*/["BAL-DAL", "ATL-DET", "CHI-MIN", "CIN-NYG", "CLE-NYJ", 'GB-JAC", "HOU-SD", "KC-CAR", "STL-PHI", "NE-PIT", "OAK-IND", "SF-WAS", "TB-NO", "TEN-DEN"],
        /*10*/["JAC-DET", "BUF-MIA", "TB-GB", "ATL-OAK", "CAR-CHI", "CIN-CLE", "DAL-SF", "DEN-SD", "STL-ARI", "NO-KC", "PHI-BAL", "SEA-NYJ", "TEN-HOU", "WAS-NYG"],
        /*11*/["BAL-MIA", "CHI-GB", "DET-TB", "HOU-IND", "KC-OAK", "MIN-TEN", "NE-DEN", "NO-KC", "NYG-PHI", "PIT-CIN", "SD-CAR", "SEA-BUF", "SF-STL", "WAS-ARI"],
        /*12*/["PIT-JAC", "OAK-HOU", "MIA-SD", "IND-TEN", "DEN-KC", "CLE-BAL", "CAR-DET", "ATL-TB", "ARI-SEA", "BUF-NE", "CHI-NO", "DAL-NYG", "GB-MIN", "STL-WAS", "NYJ-SF", "PHI-CIN"],
        /*13*/["MIA-BUF", "ARI-SF", "CLE-PIT", "DET-NO", "GB-CHI", "HOU-TEN", "JAC-IND", "KC-ATL", "MIN-CAR", "NE-SEA", "NYG-STL", "NYJ-BAL", "OAK-TB", "PHI-DAL", "SD-DEN", "WAS-CIN"],
        /*14*/["ATL-CAR", "BAL-CLE", "BUF-STL", "CHI-IND", "CIN-PIT", "HOU-KC", "NE-NYJ", "NO-GB", "PHI-ARI", "SD-JAC", "SEA-NYG", "SF-MIA", "TB-MIN", "TEN-DET", "DEN-OAK", "DAL-WAS"],
        /*15*/["WAS-PHI", "TB-CAR", "SEA-DAL", "CLE-BUF", "CIN-NE", "ATL-CHI", "DET-HOU", "GB-TEN", "IND-MIN", "PIT-BAL", "OAK-NO", "NYJ-STL", "JAC-DEN", "KC-SD", "MIA-ARI", "NYG-SF"],
        /*16*/["WAS-TB", "SD-TEN", "NO-SEA", "STL-SF", "MIA-NYJ", "MIN-ATL", "ARI-NYG", "BAL-NE", "BUF-KC", "CAR-OAK", "CLE-PHI", "DAL-PIT", "DEN-CIN", "DET-GB", "IND-HOU", "JAC-CHI"],
        /*17*/["OAK-SD", "BUF-NYJ", "NYG-DAL", "BAL-CIN", "TEN-IND", "TB-ATL", "SF-ARI", "SEA-STL", "PIT-CLE", "PHI-WAS", "NE-MIA", "MIN-GB", "KC-DEN", "HOU-JAC", "CHI-DET", "CAR-NO"],
		/*WC*/[],
		/*DV*/[],
		/*CH*/[],
		/*SB*/[]
    ],
    team_week_lists = {},
    game_list = [],
    game_list_len = 267,
	playoff_day_codes = 
	  "    " //WC
	+ "    " //DR
	+ "  " //CC
	+ "N" //SB
    ,day_codes =
      "T            NMM"  //01
    + "T             NM"  //02
    + "T             NM"  //03
    + "TI           NM"    //04
    + "T           NM"  //05
    + "T            NM"  //06
    + "TI           NM"  //07
    + "TI         NM"  //08
    + "T          NM"    //09
    + "T           NM"    //10
    + "T           NM"   //11
    + "TTT           NM"  //12
    + "T            NM" //13
    + "T             NM" //14
    + "TZ            NM" //15
    + "TZZZZZZZZZZZZ NM" //16
    + "                " //17
    ,day_explaination = { T: "Thursday game", N: "Sunday Night game", M: "Monday Night game", I: "International game", " ": "Sunday game", Z:"Saturday game" },
    bye_lookup = {
        4: "GB WAS",
        5: "TEN CIN CAR KC",
        6: "BAL	NYG OAK SD",
        7: "ATL	DEN	HOU	NO SF TB",
        8: "CHI DET LAR PHI",
        9: "ARI BUF MIA SEA",
        10: "IND MIN NE PIT",
        11: "CLE DAL JAC NYJ",
    },
    foe_lookup =
    {
        ARI: ['DAL', 'NE', 'CHI', 'STL', 'ATL', 'NYJ', 'SEA', 'BUF', 'STL', 'WAS', 'SEA', 'SF', 'PHI', 'MIA', 'NYG', 'SF'],
        ATL: ['GB', 'DEN', 'PHI', 'CAR', 'ARI', 'NO', 'CIN', 'OAK', 'NO', 'TB', 'KC', 'CAR', 'CHI', 'MIN', 'TB'],
        BAL: ['WAS', 'PIT', 'BUF', 'TEN', 'NYG', 'CIN', 'OAK', 'DAL', 'PHI', 'MIA', 'CLE', 'NYJ', 'CLE', 'PIT', 'NE', 'CIN'],
        BUF: ['CIN', 'IND', 'BAL', 'NYJ', 'NE', 'SF', 'PIT', 'ARI', 'MIA', 'SEA', 'NE', 'MIA', 'STL', 'CLE', 'KC', 'NYJ'],
        CAR: ['NO', 'SF', 'GB', 'ATL', 'DEN', 'NYG', 'TB', 'KC', 'CHI', 'SD', 'DET', 'MIN', 'ATL', 'TB', 'OAK', 'NO'],
        CHI: ['DET', 'HOU', 'ARI', 'MIN', 'TB', 'TEN', 'PHI', 'MIN', 'CAR', 'GB', 'NO', 'GB', 'IND', 'ATL', 'JAC', 'DET'],
        CIN: ['BUF', 'MIA', 'DAL', 'CLE', 'HOU', 'GAL', 'NYJ', 'NYG', 'CLE', 'PIT', 'PHI', 'WAS', 'PIT', 'NE', 'DEN', 'BAL'],
        CLE: ['NYG', 'WSH', 'MIA', 'CIN', 'DAL', 'IND', 'NE', 'KC', 'NYJ', 'CIN', 'BAL', 'PIT', 'BAL', 'BUF', 'PHI', 'PIT'],
        DAL: ['ARI', 'NO', 'CIN', 'PHI', 'CLE', 'GB', 'STL', 'WAS', 'BAL', 'SF', 'NYG', 'PHI', 'WAS', 'SEA', 'PIT', 'NYG'],
        DEN: ['TB', 'ATL', 'NO', 'OAK', 'IND', 'CAR', 'HOU', 'TEN', 'SD', 'NE', 'KC', 'SD' 'OAK', 'JAC', 'CIN', 'KC'],
        DET: ['CHI', 'MIN', 'IND', 'NYG', 'SF', 'MIN', 'GB', 'ATL', 'JAC', 'TB', 'CAR', 'NO', 'TEN', 'HOU', 'GB', 'CHI'],
        GB: ['ATL', 'SEA', 'CAR', 'HOU', 'DAL', 'DET', 'IND', 'JAC', 'TB', 'CHI', 'MIN', 'CHI', 'NO', 'TEN', 'DET', 'MIN'],
        HOU: ['MIN', 'CHI', 'NE', 'JAC', 'GB', 'CIN', 'DEN', 'SD', 'TEN', 'IND', 'OAK', 'TEN', 'KC', 'DET', 'IND', 'JAC'],
        IND: ['SD', 'BUF', 'DET', 'KC', 'DEN', 'CLE', 'JAC', 'GB', 'OAK', 'HOU', 'TEN', 'JAC', 'CHI', 'MIN', 'HOU', 'TEN'],
        JAC: ['TEN', 'KC', 'OAK', 'HOU', 'MIN', 'MIA', 'IND', 'TEN', 'GB', 'DET', 'PIT', 'IND', 'SD', 'DEN', 'CHI', 'HOU'],
        KC: ['OAK', 'JAC', 'TEN', 'IND', 'TB', 'SD', 'CLE', 'CAR', 'NO', 'OAK', 'DEN', 'ATL', 'HOU', 'SD', 'BUF', 'DEN'],
		STL: ['SEA', 'TB', 'MIN', 'ARI', 'MIA', 'NE', 'DAL', 'PHI', 'ARI', 'SF', 'WAS', 'NYG', 'BUF', 'NYJ', 'SF', 'SEA'],
        MIA: ['PIT', 'CIN', 'CLE', 'SEA', 'STL', 'JAC', 'NYJ', 'NE', 'BUF', 'BAL', 'SD', 'BUF', 'SF', 'ARI', 'NYJ', 'NE'],
        MIN: ['HOU', 'DET', 'STL', 'CHI', 'JAC', 'DET', 'WAS', 'NO', 'CHI', 'TEN', 'GB', 'CAR', 'TB', 'IND', 'ATL', 'GB'],
        NE: ['NYJ', 'ARI', 'HOU', 'SF', 'BUF', 'LAR', 'CLE', 'MIA', 'PIT', 'DEN', 'BUF', 'SEA', 'NYJ', 'CIN', 'BAL', 'MIA'],
        NO: ['CAR', 'DAL', 'DEN', 'TB', 'SD', 'ATL', 'MIN', 'TB', 'KC', 'ATL', 'CHI', 'DET', 'GB', 'OAK', 'SEA', 'CAR'],
        NYG: ['CLE', 'PHI', 'WAS', 'DET', 'BAL', 'CAR', 'PIT', 'CIN', 'WAS', 'PHI', 'DAL', 'STL', 'SEA', 'SF', 'ARI', 'DAL'],
        NYJ: ['NE', 'TEN', 'PIT', 'BUF', 'OAK', 'ARI', 'MIA', 'CIN', 'CLE', 'SEA', 'SF', 'BAL', 'NE', 'STL', 'MIA', 'BUF'],
        OAK: ['KC', 'SD', 'JAC', 'DEN', 'NYJ', 'TEN', 'BAL', 'IND', 'ATL', 'KC', 'HOU', 'TB', 'DEN', 'NO', 'CAR', 'SD'],
        PHI: ['SF', 'NYG', 'ATL', 'DAL', 'SEA', 'PIT', 'CHI', 'STL', 'BAL', 'NYG', 'CIN', 'DAL', 'ARI', 'WAS', 'CLE', 'WAS'],
        PIT: ['MIA', 'BAL', 'NYJ', 'SD', 'WAS', 'PHI', 'BUF', 'NYG', 'NE', 'CIN', 'JAC', 'CLE', 'CIN', 'BAL', 'DAL', 'CLE'],
        SD: ['IND', 'OAK', 'TB', 'PIT', 'NO', 'KC', 'ATL', 'HOU', 'DEN', 'CAR', 'MIA' 'DEN', 'JAC', 'KC', 'TEN', 'OAK'],
        SEA: ['STL', 'GB', 'SF', 'MIA', 'PHI', 'WAS', 'ARI', 'SF', 'NYJ', 'BUF', 'ARI', 'NE', 'NYG', 'DAL', 'NO', 'STL'],
        SF: ['PHI', 'CAR', 'SEA', 'NE', 'DET', 'BUF', 'SEA', 'WAS', 'DAL', 'STL', 'NYJ', 'ARI', 'MIA', 'NYG', 'LAR', 'ARI'],
        TB: ['DEN', 'STL', 'SD', 'NO', 'CHI', 'KC', 'CAR', 'NO', 'GB', 'DET', 'ATL', 'OAK', 'MIN', 'CAR', 'WAS', 'ATL'],
        TEN: ['JAC', 'NYJ', 'KC', 'BAL', 'CHI', 'OAK', 'JAC', 'DEN', 'HOU', 'MIN', 'IND', 'HOU', 'DET', 'GB', 'SD', 'IND'],
        WAS: ['BAL', 'CLE', 'NYG', 'PIT', 'SEA', 'MIN', 'DAL', 'SF', 'NYG', 'ARI', 'LAR', 'CIN', 'DAL', 'PHI', 'TB', 'PHI']
    },
    foe_hash = {
        ARI: { DAL: 1, NE: 1, CHI: 1, STL: 1, ATL: 1, NYJ: 1, SEA: 1, BUF: 1, STL: 1, WAS: 1, SEA: 1, SF: 1, PHI: 1, MIA: 1, NYG: 1, SF: 1 },
        ATL: { GB: 1, DEN: 1, PHI: 1, CAR: 1, ARI: 1, NO: 1, SD: 1, DET: 1, OAK: 1, NO: 1, TB: 1, KC: 1, CAR: 1, CHI: 1, MIN: 1, TB: 1 },
        BAL: { WAS: 1, PIT: 1, BUF: 1, TEN: 1, NYG: 1, CIN: 1, OAK: 1, DAL, 1, PHI: 1, MIA: 1, CLE: 1, NYJ: 1, CLE: 1, PIT: 1, NE: 1, CIN: 1 },
        BUF: { CIN: 1, IND: 1, BAL: 1, NYJ: 1, NE: 1, SF: 1, PIT: 1, ARI: 1, MIA: 1, SEA: 1, NE: 1, MIA: 1, STL: 1, CLE: 1, KC: 1, NYJ: 1 },
        CAR: { NO: 1, SF: 1, GB: 1, ATL: 1, DEN: 1, NYG: 1, TB: 1, KC: 1, CHI: 1, SD: 1, DET: 1, MIN: 1, ATL: 1, TB: 1, OAK: 1, NO: 1 },
        CHI: { DET: 1, HOU: 1, ARI: 1, MIN: 1, TB: 1, TEN: 1, PHI: 1, MIN: 1, CAR: 1, GB: 1, NO: 1, GB: 1, IND: 1, ATL: 1, JAC: 1, DET: 1 },
        CIN: { BUF: 1, MIA: 1, DAL: 1, CLE: 1, HOU: 1, BAL: 1, NYJ: 1, NYG: 1, CLE: 1, PIT: 1, PHI: 1, WAS: 1, PIT: 1, NE: 1, DEN: 1, BAL: 1 },
        CLE: { NYG: 1, WAS: 1, MIA: 1, CIN: 1, DAL: 1, IND: 1, NE: 1, KC: 1, NYJ: 1, CIN: 1, BAL: 1, PIT: 1, BAL: 1, BUF: 1, PHI: 1, PIT: 1 },
        DAL: { ARI: 1, NO: 1, CIN: 1, PHI: 1, CLE: 1, GB: 1, LAR: 1, WAS: 1, BAL: 1, SF: 1, NYG: 1, PHI: 1, WAS: 1, SEA: 1, PIT: 1, NYG: 1 },
        DEN: { TB: 1, ATL: 1, NO: 1, OAK: 1, IND: 1, CAR: 1, HOU: 1, TEN: 1, SD: 1, NE: 1, KC: 1, SD: 1, OAK: 1, JAC: 1, CIN: 1, KC: 1 },
        DET: { CHI: 1, MIN: 1, IND: 1, NYG: 1, SF: 1, MIN: 1, GB: 1, ATL: 1, JAC: 1, TB: 1, CAR: 1, NO: 1, TEN: 1, HOU: 1, GB: 1, CHI: 1 },
        GB: { ATL: 1, SEA: 1, CAR: 1, HOU: 1, DAL: 1, DET: 1, IND: 1, JAC: 1, TB: 1, CHI: 1, MIN: 1, CHI: 1, NO: 1, TEN: 1, DET: 1 , MIN: 1 },
        HOU: { MIN: 1, CHI: 1, NE: 1, JAC: 1, GB: 1, CIN: 1, DEN: 1, SD: 1, TEN: 1, IND: 1, OAK: 1, TEN: 1, KC: 1, DET: 1 ,IND: 1, JAC: 1 },
        IND: { SD: 1, BUF: 1, DET: 1, KC: 1, DEN: 1, CLE: 1, JAC: 1, GB: 1, OAK: 1, HOU: 1, TEN: 1, JAC: 1, CHI: 1, MIN: 1, HOU: 1, TEN: 1 },
        JAC: { TEN: 1, KC: 1, OAK: 1, HOU: 1, MIN: 1, MIA: 1, IND: 1, TEN: 1, GB: 1, DET: 1, PIT: 1, IND: 1, SD: 1, DEN: 1, CHI: 1, HOU: 1 },
        KC: { OAK: 1, JAC: 1, TEN: 1, IND: 1, TB: 1, SD: 1, CLE: 1, CAR: 1, NO: 1, OAK: 1, DEN: 1, ATL: 1, HOU: 1, SD: 1, BUF: 1, DEN: 1 },
		STL: { SEA; 1, TB: 1, MIN: 1, ARI: 1, MIA: 1, NE: 1, DAL: 1, PHI: 1, ARI: 1, SF: 1, WAS: 1, NYG: 1, BUF: 1, NYJ: 1, SF: 1, SEA: 1 },
        MIA: { PIT: 1, CIN: 1, CLE: 1, SEA: 1, STL: 1, JAC: 1, NYJ: 1, NE: 1, BUF: 1, BAL: 1, SD: 1, BUF: 1, SF: 1, ARI: 1, NYJ: 1, NE: 1 },
        MIN: { HOU: 1, DET: 1, LAR: 1, CHI: 1, JAC: 1, DET: 1, WAS: 1, NO: 1, CHI: 1, TEN: 1, GB:1, CAR: 1, TB: 1, IND: 1, ATL: 1, GB: 1 },
        NE: { NYJ: 1, ARI: 1, HOU: 1, SF:1 , BUF: 1, LAR: 1, CLE: 1, MIA: 1, PIT: 1, DEN: 1, BUF: 1, SEA: 1, NYJ: 1, CIN: 1, BAL: 1, MIA: 1 },
        NO: { CAR: 1, DAL: 1, DEN: 1, TB: 1, SD:1 , ATL: 1, MIN: 1, TB: 1, KC: 1, ATL: 1, CHI: 1, DET: 1, GB: 1, OAK: 1, SEA: 1, CAR: 1 },
        NYG: { CLE: 1, PHI: 1, WAS: 1, DET: 1, BAL: 1, CAR: 1, PIT: 1, CIN: 1, WAS: 1, PHI: 1, DAL: 1, STL: 1, SEA: 1, SF: 1, ARI: 1, DAL: 1 },
        NYJ: { NE:1, TEN: 1, PIT: 1, BUF: 1, OAK: 1, ARI: 1, MIA: 1, CIN: 1, CLE: 1, SEA: 1, SF: 1, BAL: 1, NE: 1, STL: 1, MIA: 1, BUF: 1 },
        OAK: { KC: 1, SD: 1, JAC: 1, DEN: 1 ,NYJ: 1, TEN :1, BAL: 1, IND: 1, ATL: 1, KC: 1, HOU: 1, TB: 1, DEN: 1, NO: 1, CAR: 1, SD: 1 },
        PHI: { SF: 1,NYG: 1, ATL: 1, DAL: 1, SEA: 1, PIT: 1, CHI: 1, STL: 1 ,BAL: 1, NYG:1, CIN: 1, DAL: 1, ARI: 1, WAS: 1, CLE: 1, WAS: 1 },
        PIT: { MIA: 1, BAL: 1 , NYJ: 1, SD: 1, WAS: 1, PHI: 1, BUF: 1, NYG: 1, NE: 1, CIN: 1, JAC: 1, CLE: 1, CIN: 1, BAL: 1, DAL: 1, CLE: 1 },
        SD: { IND: 1, OAK: 1, TB: 1, PIT: 1, NO: 1, KC: 1, ATL: 1, HOU: 1, DEN: 1, CAR: 1, MIA: 1, DEN: 1, JAC: 1, KC: 1, TEN: 1, OAK: 1 },
        SEA: { STL: 1, GB: 1, SF: 1, MIA: 1, WAS: 1, ARI: 1, SF: 1, NYJ: 1, BUF: 1, ARI: 1, NE: 1, NYG: 1, DAL: 1, NO: 1, STL: 1 },
        SF: { PHI: 1, CAR: 1, SEA: 1, NE: 1, DET: 1, BUF: 1, SEA: 1, WAS: 1, DAL: 1, STL: 1, NYJ: 1, ARI: 1, MIA: 1, NYG: 1, STL: 1, ARI: 1 },
        TB: { DEN: 1, STL: 1, SD: 1, NO: 1, CHI: 1, KC: 1, CAR: 1, NO: 1, GB: 1, DET: 1, ATL: 1, OAK: 1, MIN: 1, CAR: 1, WAS: 1, ATL: 1 },
        TEN: { JAC: 1, NYJ: 1, KC: 1 ,BAL :1 ,CHI: 1, OAK: 1, JAC: 1, DEN: 1, HOU: 1, MIN: 1, IND: 1, HOU: 1, DET: 1 ,GB: 1, SD: 1, IND: 1 },
        WAS: { BAL: 1, CLE: 1, NYG:1 ,PIT: 1, SEA: 1, MIN:1 , DAL: 1, SF: 1, NYG: 1, ARI: 1, STL: 1, CIN: 1, DAL: 1, PHI: 1, TB: 1, PHI: 1 }
    }, unique_foes = 13,
    NFL_teams = ["ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET", "GB", "HOU", "IND", "JAC", "KC", "STL", "MIA", "MIN", "NE", "NO", "NYG", "NYJ", "OAK", "PHI", "PIT", "SD", "SEA", "SF", "TB", "TEN", "WAS"],
    NFL_teams_len = NFL_teams.length,
    division_teams = {
        AE: ["BUF", "MIA", "NE", "NYJ"],
        AN: ["BAL", "CLE", "CIN", "PIT"],
        AS: ["HOU", "IND", "JAC", "TEN"],
        AW: ["DEN", "KC", "OAK", "SD"],
        NE: ["DAL", "NYG", "PHI", "WAS"],
        NN: ["CHI", "DET", "GB", "MIN"],
        NS: ["ATL", "CAR", "NO", "TB"],
        NW: ["ARI", "STL", "SF", "SEA"]
    },
    division = {
        BUF: "AE",
        MIA: "AE",
        NE: "AE",
        NYJ: "AE",
        BAL: "AN",
        CLE: "AN",
        CIN: "AN",
        PIT: "AN",
        HOU: "AS",
        IND: "AS",
        JAC: "AS",
        TEN: "AS",
        DEN: "AW",
        KC: "AW",
        OAK: "AW",
        SD: "AW",
        DAL: "NE",
        NYG: "NE",
        PHI: "NE",
        WAS: "NE",
        CHI: "NN",
        DET: "NN",
        GB: "NN",
        MIN: "NN",
        ATL: "NS",
        CAR: "NS",
        NO: "NS",
        TB: "NS",
        ARI: "NW",
		STL: "NW",
        SF: "NW",
        SEA: "NW"
    },
    table_offsets = {
        NE: 1,
        NN: 6,
        NS: 11,
        NW: 16,
        AE: 1,
        AN: 6,
        AS: 11,
        AW: 16
    }, active_tab,
    tab_prefixes = [
        "week-1",
        "week-2",
        "week-3",
        "week-4",
        "week-5",
        "week-6",
        "week-7",
        "week-8",
        "week-9",
        "week-10",
        "week-11",
        "week-12",
        "week-13",
        "week-14",
        "week-15",
        "week-16",
        "week-17",
		"week-18",
		"week-19",
		"week-20",
		"week-21",
        "help",
		"tie-explain",
        "BUF",
        "MIA",
        "NE",
        "NYJ",
        "BAL",
        "CLE",
        "CIN",
        "PIT",
        "HOU",
        "IND",
        "JAC",
        "TEN",
        "DEN",
        "KC",
        "OAK",
        "SD",
        "DAL",
        "NYG",
        "PHI",
        "WAS",
        "CHI",
        "DET",
        "GB",
        "MIN",
        "ATL",
        "CAR",
        "NO",
        "TB",
        "ARI",
        "SF",
        "STL",
        "SEA"
    ],
    team_name = {
        ARI: "Arizona Cardinals",
        ATL: "Atlanta Falcons",
        BAL: "Baltimore Ravens",
        BUF: "Buffalo Bills",
        CAR: "Carolina Panthers",
        CHI: "Chicago Bears",
        CIN: "Cincinnati Bengals",
        CLE: "Cleveland Browns",
        DAL: "Dallas Cowboys",
        DEN: "Denver Broncos",
        DET: "Detroit Lions",
        GB: "Green Bay Packers",
        HOU: "Houston Texans",
        IND: "Indianapolis Colts",
        JAC: "Jacksonville Jaguars",
        KC: "Kansas City Chiefs",
		STL: "St. Louis Rams",
        MIA: "Miami Dolphins",
        MIN: "Minnesota Vikings",
        NE: "New England Patriots",
        NO: "New Orleans Saints",
        NYG: "New York Giants",
        NYJ: "New York Jets",
        OAK: "Oakland Raiders",
        PHI: "Philadelphia Eagles",
        PIT: "Pittsburgh Steelers",
        SD: "San Diego Chargers",
        SEA: "Seattle Seahawks",
        SF: "San Francisco 49ers",
        TB: "Tampa Bay Buccaneers",
        TEN: "Tennessee Titans",
        WAS: "Washington Redskins"
    },
    NFC_table = document.getElementById("NFC-table"),
    AFC_table = document.getElementById("AFC-table"),
    table_divider = '<div style="float:left">&nbsp;&nbsp;&nbsp;&nbsp;</div>',
    NO_GAME = 0,
    AWAY_WIN = 1,
    HOME_WIN = 2,
    TIE_GAME = 3,
    WINS = 0,
    LOSSES = 1,
    TIES = 2,
    cookie_bits = [],
    cookie_letters = [],
    game_position = {},
    game_states = {},
	playoff_game_position = {},
	playoff_game_states = {},
    unpicked_games_count = game_list_len,
    conf_record = {},
    div_record = {},
    all_record = {},
    SOS_record = {},
    SOV_record = {},
	conf_points_for = {},
	all_points_for = {},
	conf_points_against = {},
	all_points_against = {},
    conf_pct = {},
    div_pct = {},
    all_pct = {},
    team_pct = {},
    SOS_pct = {},
    SOV_pct = {},
	conf_points_rank = {},
	all_points_rank = {},
	net_points_common = {},
	net_points_all = {},
	num_touchdowns = {},
    ii,
    jj,
	tie_explain = [];
my_init_func();
function my_init_func() {
    var g = getCookie(games_cookie_name), b = getParam("a"), e, f, a, d, c, h; for (e = NFL_teams_len; e--;) {
        team_week_lists[NFL_teams[e]] = []
    }
    for (e = 0; e < number_of_weeks; e++) {
        a = week_lists[e]; d = a.length;
        Array.prototype.push.apply(game_list, a);
        for (f = 0; f < d; f++) {
            c = a[f];
            h = c.match(/(\w+)-(\w+)/);
            team_week_lists[h[1]][e] = c;
            team_week_lists[h[2]][e] = c
        }
    }
    for (e = game_list_len; e--;) {
        game_position[game_list[e]] = e
    }
    clear_data();
    if (b !== "") {
        set_games_from_string(b)
    }
    else {
        if (g !== null && g !== "") {
            set_games_from_string(g)
        }
    }
    set_all_rankings();
    show_week_tab("week-1");
    set_game_cookie(cookie_letters, true)
}
function calc_pct(a) {
    var b = a[WINS] + a[LOSSES] + a[TIES];
    if (b === 0) {
        return 0
    }
    return (a[WINS] + 0.5 * a[TIES]) / b
}
function coin_flip(b) {
    var c = b[0], a;
    for (a = 1; a < b.length; a++) {
        if (b[a] < c) { c = b[a] }
    }
    return c;
}
function clear_data() {
    var c,
        b,
        a;
    unpicked_games_count = 256;
    for (c = NFL_teams_len; c--;) {
        a = NFL_teams[c];
        document.getElementById(a + "-WLT").innerHTML = "0-0";
        document.getElementById(a + "-div").innerHTML = "0-0";
        all_record[a] = [0, 0, 0];
        conf_record[a] = [0, 0, 0];
        div_record[a] = [0, 0, 0];
        SOS_record[a] = [0, 0, 0];
        SOV_record[a] = [0, 0, 0];
        all_pct[a] = 0;
        conf_pct[a] = 0;
        div_pct[a] = 0;
        SOS_pct[a] = 0;
        SOV_pct[a] = 0
    }
    for (c = game_list_len; c--;) {
        b = game_list[c];
        game_states[b] = NO_GAME
    }
    for (c = cookie_letter_length; c--;) {
        cookie_bits[c] = 0;
        cookie_letters[c] = "A"
    }
	
	edit_playoffs();
}

function set_games_from_string(b) {
    if (b.match(cookie64_re) === null) {
        alert("Game data is corrupt, sorry. :(");
        clear_data(); return
    }
    var a = [],
        c = b.substring(1, 1 + cookie_letter_length).split("");
    ii;
    for (ii = 0; ii < cookie_letter_length; ii++) {
        value = base64.indexOf(c[ii]);
        a[ii] = value
    }
    for (ii = 0; ii < game_list_len; ii++) {
        bit_subslot = ii % 3;
        bit_slot = (ii - bit_subslot) / 3; game_value = (a[bit_slot] >> (bit_subslot * 2)) & 3;
        change_game(game_list[ii], game_value)
    }
}

function xor_cookie_bits(b, c, a) {
    position = game_position[b];
    bit_subslot = position % 3;
    bit_slot = (position - bit_subslot) / 3;
    new_value = cookie_bits[bit_slot] ^ ((c ^ a) * Math.pow(4, bit_subslot));
    cookie_bits[bit_slot] = new_value;
    cookie_letters[bit_slot] = base64[new_value];
}

function reset_button() {
    if (confirm("Reset all games to unpicked?")) {
        clear_data(); set_all_rankings();
        set_game_cookie(cookie_letters, true);
        show_week_tab("week-1")
    }
}

function set_game_buttons(b, a) {
    var c = b.match(/(\w+)-(\w+)/);
    if (document.getElementById(b + "-away-td") === null) {
        return
    }
    switch (a) {
        case AWAY_WIN:
            document.getElementById(b + "-away-td").className = c[2] == active_tab ? "team-font selected other-team-tab" : "team-font selected " + c[1];
            document.getElementById(b + "-tie-td").className = "anti-selected"; document.getElementById(b + "-home-td").className = "team-font anti-selected";
            break;
        case HOME_WIN:
            document.getElementById(b + "-away-td").className = "team-font anti-selected";
            document.getElementById(b + "-tie-td").className = "anti-selected";
            document.getElementById(b + "-home-td").className = c[1] == active_tab ? "team-font selected other-team-tab" : "team-font selected " + c[2];
            break;
        case TIE_GAME:
            document.getElementById(b + "-away-td").className = "team-font tied-team";
            document.getElementById(b + "-tie-td").className = "selected tied-tie";
            document.getElementById(b + "-home-td").className = "team-font tied-team";
            break;
        case NO_GAME:
            document.getElementById(b + "-away-td").className = "team-font not-selected";
            document.getElementById(b + "-tie-td").className = "not-selected";
            document.getElementById(b + "-home-td").className = "team-font not-selected";
            break
    }
}

function set_standings_game(b, a) {
    var c = b.match(/(\w+)-(\w+)/);

    switch (a) {
        case AWAY_WIN:
            modify_game(b, c[1], c[2], 1, 0);
            break;
        case HOME_WIN:
            modify_game(b, c[2], c[1], 1, 0);
            break;
        case TIE_GAME:
            modify_game(b, c[1], c[2], 0, 1);
            break
    }
}

function change_game(c, b) {
    var a = game_states[c],
        d;
		
	if((active_tab == 'week-18') || (active_tab == 'week-19') || (active_tab == 'week-20') || (active_tab == 'week-21')) {
		a = playoff_game_states[c]
	}
		
    if (a != b) {
		
		if((active_tab != 'week-18') && (active_tab != 'week-19') && (active_tab != 'week-20') && (active_tab != 'week-21')) {
			d = c.match(/(\w+)-(\w+)/); game_states[c] = b;
			xor_cookie_bits(c, a, b);
		} else {
			d = c.match(/(\w+)-(\w+)/); playoff_game_states[c] = b;
		}
		
        switch (a) {
            case AWAY_WIN:
                modify_game(c, d[1], d[2], -1, 0);
                break;
            case HOME_WIN:
                modify_game(c, d[2], d[1], -1, 0);
                break;
            case TIE_GAME:
                modify_game(c, d[1], d[2], 0, -1);
                break;
            case NO_GAME:
                break
        }
        set_standings_game(c, b); set_game_buttons(c, b)
    }
}

function wgc(b, a) {
	
	tie_explain = [];
	if((active_tab != 'week-18') && (active_tab != 'week-19') && (active_tab != 'week-20') && (active_tab != 'week-21')) {
		if (a == game_states[b]) {
			a = NO_GAME
		}
	} else {
		if (a == playoff_game_states[b]) {
			a = NO_GAME
		}
	}
    change_game(b, a);
    set_game_cookie(cookie_letters);
    set_all_rankings();
	edit_playoffs();
}

function set_all_rankings() {
    var d = [],
        a = [],
        c = {},
        b;
    if (unpicked_games_count > 255) {
        b = "You haven't picked any games. "
    }
    else {
        if (unpicked_games_count > 1) {
            b = "You have " + unpicked_games_count + " unpicked games. "
        }
        else {
            if (unpicked_games_count > 0) {
                b = "You have 1 unpicked game. "
            }
            else {
                b = ""
            }
        }
    }
    document.getElementById("unpicked-warning").innerHTML = b;
    conf_ranker(
        [
            div_ranker("NE", NFC_table, a, c),
            div_ranker("NN", NFC_table, a, c),
            div_ranker("NS", NFC_table, a, c),
            div_ranker("NW", NFC_table, a, c)
        ], 'NFC'
    );

    conf_ranker(
        [
            div_ranker("AE", AFC_table, d, c),
            div_ranker("AN", AFC_table, d, c),
            div_ranker("AS", AFC_table, d, c),
            div_ranker("AW", AFC_table, d, c)
        ], 'AFC');

    wild_ranker(d, c, 'AFC');
    wild_ranker(a, c, 'NFC');
}

function wild_ranker(c, b, confName) {
    var e = c.slice(0),
        a,
        d;

    a = conf_pick_top(e);
    document.getElementById(a + "-conf-rank").innerHTML = '<font color="green"><b>5</b></font>';
    e.splice(e.indexOf(a), 1); e.push(b[a]); d = conf_pick_top(e);
    document.getElementById(d + "-conf-rank").innerHTML = '<font color="green"><b>6</b></font>';
    conferenceRankingObject[confName].placements[5] = { name: a, record: all_record[a] };
    conferenceRankingObject[confName].placements[6] = { name: d, record: all_record[d] };
	
	//Non-Playoff Teams
	e.splice(e.indexOf(d), 1); e.push(b[d]);
	var seventhPlace = conf_pick_top(e);
	document.getElementById(seventhPlace + "-conf-rank").innerHTML = '<font color="red">7</font>';
	
	cleanArray(e);
	e.splice(e.indexOf(seventhPlace), 1); e.push(b[seventhPlace]);
	var eighthPlace = conf_pick_top(e);
	document.getElementById(eighthPlace + "-conf-rank").innerHTML = '<font color="red">8</font>';
	
	cleanArray(e);
	e.splice(e.indexOf(eighthPlace), 1); e.push(b[eighthPlace]);
	var ninthPlace = conf_pick_top(e);
	document.getElementById(ninthPlace + "-conf-rank").innerHTML = '<font color="red">9</font>';
	
	cleanArray(e);
	e.splice(e.indexOf(ninthPlace), 1); e.push(b[ninthPlace]);
	var tenthPlace = conf_pick_top(e);
	document.getElementById(tenthPlace + "-conf-rank").innerHTML = '<font color="red">10</font>';
	
	cleanArray(e);
	e.splice(e.indexOf(tenthPlace), 1); e.push(b[tenthPlace]);
	var eleventhPlace = conf_pick_top(e);
	document.getElementById(eleventhPlace + "-conf-rank").innerHTML = '<font color="red">11</font>';
	
	cleanArray(e);
	e.splice(e.indexOf(eleventhPlace), 1); e.push(b[eleventhPlace]);
	var twelthPlace = conf_pick_top(e);
	document.getElementById(twelthPlace + "-conf-rank").innerHTML = '<font color="red">12</font>';
	
	cleanArray(e);
	e.splice(e.indexOf(twelthPlace), 1); e.push(b[twelthPlace]);
	var thirteenthPlace = conf_pick_top(e);
	document.getElementById(thirteenthPlace + "-conf-rank").innerHTML = '<font color="red">13</font>';
	
	cleanArray(e);
	e.splice(e.indexOf(thirteenthPlace), 1); e.push(b[thirteenthPlace]);
	var fourteenthPlace = conf_pick_top(e);
	document.getElementById(fourteenthPlace + "-conf-rank").innerHTML = '<font color="red">14</font>';
	
	cleanArray(e);
	e.splice(e.indexOf(fourteenthPlace), 1); e.push(b[fourteenthPlace]);
	var fifthteenthPlace = conf_pick_top(e);
	document.getElementById(fifthteenthPlace + "-conf-rank").innerHTML = '<font color="red">15</font>';
	
	cleanArray(e);
	e.splice(e.indexOf(fifthteenthPlace), 1); e.push(b[fifthteenthPlace]);
	var sixteenthPlace = conf_pick_top(e);
	document.getElementById(sixteenthPlace + "-conf-rank").innerHTML = '<font color="red">16</font>';
}

function cleanArray(e) {
	
	for (var i = 0; i < e.length; i++) {
		if (e[i] == undefined) {         
			e.splice(i, 1);
		i--;
		}
	}
	return e;
}

function exchange(d, c, b) {
    var a = b.tBodies[0].getElementsByTagName("tr"),
        e,
        f = 4;
    if (parseFloat(b.rows[d].cells[f].textContent) < parseFloat(b.rows[c].cells[f].textContent)) {
        return;
    }
    if (d == c + 1) {
        b.tBodies[0].insertBefore(a[d], a[c])
    }
    else {
        if (c == d + 1) {
            b.tBodies[0].insertBefore(a[c], a[d])
        }
        else {
            e = b.tBodies[0].replaceChild(a[d], a[c]);
            if (typeof (a[d]) != "undefined") {
                b.tBodies[0].insertBefore(e, a[d])
            }
            else {
                b.appendChild(e)
            }
        }
    }
}

function sort_div(c, a) {
    var b = table_offsets[c];
    exchange(b, b + 2, a);
    exchange(b + 1, b + 3, a);
    exchange(b, b + 1, a);
    exchange(b + 2, b + 3, a);
    exchange(b + 1, b + 2, a)
}

function conf_ranker(c, confName) {
    if (unpicked_games_count === 256) return;
    var e = c.slice(0),
        b,
        d,
        a;

    b = conf_pick_top(e);
    document.getElementById(b + "-conf-rank").innerHTML = '<font color="green"><b>1</b></font>';
    e.splice(e.indexOf(b), 1);
    d = conf_pick_top(e);
    document.getElementById(d + "-conf-rank").innerHTML = '<font color="green"><b>2</b></font>';
    e.splice(e.indexOf(d), 1); a = conf_pick_top(e);
    document.getElementById(a + "-conf-rank").innerHTML = '<font color="green"><b>3</b></font>';
    e.splice(e.indexOf(a), 1);
    document.getElementById(e[0] + "-conf-rank").innerHTML = '<font color="green"><b>4</b></font>';
    if (confName) {
        conferenceRankingObject[confName] = {
            name: confName,
            placements: {}
        };
        conferenceRankingObject[confName].placements[1] = { name: b, record: all_record[b] };
        conferenceRankingObject[confName].placements[2] = { name: d, record: all_record[d] };
        conferenceRankingObject[confName].placements[3] = { name: a, record: all_record[a] };
        conferenceRankingObject[confName].placements[4] = { name: e[0], record: all_record[e[0]] }
    }
}

function div_ranker(b, d, c, f) {
    var h = division_teams[b].slice(0),
        e,
        g,
        a,
		l;

    e = division_pick_top(h);
    document.getElementById(e + "-div-rank").innerHTML = 1;
    h.splice(h.indexOf(e), 1);
    g = division_pick_top(h);
    document.getElementById(g + "-div-rank").innerHTML = 2;
    document.getElementById(g + "-conf-rank").innerHTML = "";
    h.splice(h.indexOf(g), 1);
    c.push(g);
    a = division_pick_top(h);
    document.getElementById(a + "-div-rank").innerHTML = 3;
    document.getElementById(a + "-conf-rank").innerHTML = "";
    h.splice(h.indexOf(a), 1); f[g] = a;
    document.getElementById(h[0] + "-div-rank").innerHTML = 4;
    document.getElementById(h[0] + "-conf-rank").innerHTML = "";
	f[a] = h[0];
    sort_div(b, d);
    return e
}

function conf_pick_top(a) {
    remaining_teams = best_pct(a, all_pct);
    if (remaining_teams.length == 1) {
        return remaining_teams[0];
    }
    return (conf_tiebreaker(remaining_teams));
}

function conf_tiebreaker(b) {
    var a = (b.length > 2),
        c = b.slice(0);
	
	//Head to Head
    c = hth_conf(b);
    switch (c.length) {
        case 1:
            return c[0];
        case 2:
            if (a) {
                return conf_tiebreaker(c);
            }
    }
	
	//Conference Record
    c = best_pct(c, conf_pct);
    switch (c.length) {
        case 1:
            return c[0];
        case 2:
            if (a) {
                return conf_tiebreaker(c)
            }
    }
	
	//Common Games
	c = best_common_pct(c);
    switch (c.length) {
        case 1:
            return c[0];
        case 2:
            if (a) {
                return conf_tiebreaker(c);
            }
    }
	
	//Strength of Victory
    c = best_pct(c, SOV_pct);

    switch (c.length) {
        case 1:
            return c[0];
        case 2:
            if (a) {
                return conf_tiebreaker(c);
            }
    }
	
	//Strength of Schedule
    c = best_pct(c, SOS_pct);
    switch (c.length) {
        case 1:
            return c[0];
        case 2:
            if (a) {
                return conf_tiebreaker(c);
            }
    }
	
	//Best combined ranking among conference teams in points scored and allowed
	
	
	//Best combined ranking among all teams in points scored and allowed
	//Best net points in common games
	//Best net points in all games
	//Best net touchdowns in all games
    return coin_flip(c);
}
function division_pick_top(a) {
    remaining_teams = best_pct(a, all_pct);
    if (remaining_teams.length == 1) {
        return remaining_teams[0]
    } return (division_tiebreaker(remaining_teams))
}

function combinedPointsRank() {
	
}

function division_tiebreaker(b) {
    var a = (b.length > 2),
        c;
		
	//Head to Head
    c = hth_div(b);
    switch (c.length) {
        case 1:
            return c[0];
        case 2:
            if (a) {
                return division_tiebreaker(c)
            }
    }
	
	//Division Record
    c = best_pct(c, div_pct);

    switch (c.length) {
        case 1:
            return c[0];
        case 2:
            if (a) {
                return division_tiebreaker(c)
            }
    }
	
	//Common Games
    c = best_common_pct(c);
    switch (c.length) {
        case 1:
            return c[0];
        case 2:
            if (a) {
                return division_tiebreaker(c);
            }
    }
	
	//Conference Record
    c = best_pct(c, conf_pct);
    switch (c.length) {
        case 1:
            return c[0];
        case 2: if (a) {
            return division_tiebreaker(c);
        }
    }
	
	//Strength of Victory
    c = best_pct(c, SOV_pct);
    switch (c.length) {
        case 1:
            return c[0];
        case 2:
            if (a) {
                return division_tiebreaker(c)
            }
    }
	
	//Strength of Schedule
	c = best_pct(c, SOS_pct);
    switch (c.length) {
        case 1:
            return c[0];
        case 2:
            if (a) {
                return division_tiebreaker(c);
            }
    }
	
	//Best combined ranking among conference teams in points scored and allowed
	//Best combined ranking among all teams in points scored and allowed
	//Best net points in common games
	//Best net points in all games
	//Best net touchdowns in all games
    return coin_flip(c);
}

function hth_conf(e) {
    var g,
        a = e.length,
        b,
        f,
        c,
        d;
    for (c = a; c--;) {
        b = e[c];
        for (d = a; d--;) {
            if (c == d) {
                continue;
            }
            f = e[d];
            if (!(game_states[b + "-" + f] == AWAY_WIN || game_states[f + "-" + b] == HOME_WIN)) {
                break;
            }
        }
        if (d < 0) { return [b] }
    }
    for (c = a; c--;) {
        b = e[c];
        for (d = a; d--;) {
            if (c == d) {
                continue;
            }
            f = e[d];
            if (!(game_states[b + "-" + f] == HOME_WIN || game_states[f + "-" + b] == AWAY_WIN)) {
                break;
            }
        }
        if (d < 0) {
            g = e.slice(0);
            g.splice(c, 1);
            return g
        }
    } return e
}

function hth_div(g) {
    var a, f = {},
        h = {},
        d, e, c,
        b;

    a = g.length;
    for (d = a; d--;) {
        f[g[d]] = [0, 0, 0]
    }
    for (d = a; d--;) {
        c = g[d];

        for (e = a; e--;) {
            if (d == e) {
                continue;
            }
            b = g[e];
            switch (game_states[c + "-" + b]) {
                case AWAY_WIN:
                    f[c][WINS]++;
                    f[b][LOSSES]++;
                    break;
                case HOME_WIN:
                    f[b][WINS]++;
                    f[c][LOSSES]++;
                    break;
                case TIE_GAME:
                    f[c][TIES]++;
                    f[b][TIES]++;
                    break
            }
        }
    }
    for (d = a; d--;) {
        c = g[d]; h[c] = calc_pct(f[c])
    }
    return best_pct(g, h);
}

function common_foes(f) {
    var e = foe_lookup[f[0]],
        c = f.length, a = [],
        b,
        d;

    loop_first_foes:
        for (b = 0; b < unique_foes; b++) {
            foe_to_check = e[b];
            for (d = 1; d < c; d++) {
                if (foe_hash[f[d]][foe_to_check] == undefined) {
                    continue loop_first_foes;
                }
            }
            a.push(foe_to_check)
        } return a
}

function best_common_pct(g) {
    var h = g.length,
        f = {},
        a = common_foes(g),
        b = a.length,
        k,
        e,
        c,
        d,
        j,
        i = [];

    for (k = h; k--;) {
        f[g[k]] = [0, 0, 0]
    }
    for (k = 0; k < b; k++) {
        c = a[k];

        for (e = 0; e < h; e++) {
            d = g[e]; j = f[d]; switch (game_states[c + "-" + d]) {
                case AWAY_WIN:
                    j[LOSSES]++;
                    break;
                case HOME_WIN:
                    j[WINS]++;
                    break;
                case TIE_GAME:
                    j[TIES]++;
                    break
            }

            switch (game_states[d + "-" + c]) {
                case AWAY_WIN:
                    j[WINS]++;
                    break;
                case HOME_WIN:
                    j[LOSSES]++;
                    break;
                case TIE_GAME:
                    j[TIES]++;
                    break
            }
        }
    }

    for (k = 0; k < g.length; k++) {
        d = g[k];
        j = f[d];
        if (j[WINS] + j[LOSSES] + j[TIES] < 4) {
            return g;
        }
        i[d] = calc_pct(j)
    }
    return best_pct(g, i)
}

function best_pct(e, d) {
    var b = [e[0]],
        a = d[e[0]],
        c;

    for (c = 1; c < e.length; c++) {
        test_pct = d[e[c]];
        if (test_pct > a) {
            b = [e[c]];
            a = test_pct
        }
        else {
            if (test_pct == a) {
                b.push(e[c]);
            }
        }
    }
    return b;
}

function set_tabbing_buttons(b) {
    var a = tab_prefixes.length,
        c,
        d;

    active_tab = b;
    document.getElementById("help-tab").style.display = "none";
    autogen_tab.style.display = "block";
    for (c = a; c--;) {
        d = tab_prefixes[c];
        if (d == b) {
            document.getElementById(d + "-button").className = "button_down"
        }
        else {
            document.getElementById(d + "-button").className = "button_up"
        }
    }
}
function show_help() {
    set_tabbing_buttons("help");
    autogen_tab.style.display = "none";
    document.getElementById("help-tab").style.display = "block";
}

function show_week_tab(e) {
    var d,
        g,
        b,
        f,
        c,
        a = document.getElementById("autogen_tab");

    set_tabbing_buttons(e);
    a.className = "";
    d = e.match(/week-(\d+)/);
    g = parseInt(d[1], 10);
    b = week_lists[g - 1];
    a.innerHTML = week_tab(e, g, b);
    for (f = b.length; f--;) {
        c = b[f];
		
		if((active_tab != 'week-18') && (active_tab != 'week-19') && (active_tab != 'week-20') && (active_tab != 'week-21')) {
			set_game_buttons(c, game_states[c])
		} else {
			set_game_buttons(c, playoff_game_states[c])
		}
    }
}

function show_team_tab(c) {
    set_tabbing_buttons(c);
    var a = document.getElementById("autogen_tab"),
        d,
        b;
    a.className = c;
    a.innerHTML = team_header(c) + '<div style="clear:both"><br></div>' + make_team_game_tables(c);
    d = team_week_lists[c];
    for (ii = d.length; ii--;) {
        b = d[ii];
        if (b != undefined) {
            set_game_buttons(b, game_states[b]);
        }
    }
}

function week_tab(e, k, p) {
    var j,
        o,
        l,
        i = [],
        m = [],
        b = [],
        a = "",
        d,
        h,
        f,
        c = "", g = "", n; d = bye_lookup[k]; if (d != undefined) {
            a = '<div class="bye_header">Byes: ' + d + "</div>"
        }
    j = p.length; for (n = 0; n < j; n++) {
        o = p[n]; l = o.match(/(\w+)-(\w+)/);
        h = division[l[1]][0];
        f = division[l[2]][0];
        if (h != f) {
            m.push(o)
        }
        else {
            if (h == "A") {
                i.push(o)
            }
            else { b.push(o) }
        }
    }
    if (k > 1) {
        c = '<input class="button_up" type="button" onclick="show_week_tab(\'week-' + (k - 1) + '\')"value="<-- Go to Week ' + (k - 1) + '"></input>';
    }
    if (k < number_of_weeks) {
        g = '<input class="button_up" type="button" style="text-align:right" onclick="show_week_tab(\'week-' + (k + 1) + '\')"value="Go to Week ' + (k + 1) + ' -->"></input>'
    }
    return "Week " + k + ":" + a + "<div>" + week_game_table("AFC", i) + table_divider + week_game_table("AFC vs. NFC", m) + table_divider + week_game_table("NFC", b) + '</div><div style="clear:both"><br></div><div><div style="float:left">' + c + '</div><div style="float:right">' + g + "</div></div>" + table_divider
}

function team_header(b) {
    var a,
        c;
    a = team_name[b].toUpperCase().match(/(.*)\s(.*)/);
    c = a[1] + "&nbsp;<br>" + a[2];
    return '<div><div class="m-icon sp-m' + b + '" style="float: left"></div><div class="team-header" style="float: left">&nbsp;' + c + '&nbsp</div><div class="m-icon sp-m' + b + '" style="float: left"></div><table class="recordtable" style="float: right"><tr><th>WLT</th><th>Div</th><th>Conf</th></tr><tr><td id="team-WLT">' + WLT_string(all_record[b]) + '</td><td id="team-div">' + WLT_string(div_record[b]) + '</td><td id="team-conf">' + WLT_string(conf_record[b]) + '</td></tr><tr><th>SOV</th><th>SOS</th><th></th></tr><tr><td id="team-SOV">' + SOV_pct[b].toFixed(3) + '</td><td id="team-SOS">' + SOS_pct[b].toFixed(3) + "</td><td></td></tr></table></div>";
}

function make_team_game_tables(a) {
    return team_game_table(1, 6, a) + table_divider + team_game_table(7, 12, a) + table_divider + team_game_table(13, 17, a)
}

function week_game_table(g, b) {
    var c,
        e,
        j = "",
        a = "",
        f = "",
        k = "",
        i,
        h,
		o,
        d;

    c = '<div style="float:left"><table class="gametable"><tr><th colspan="3">' + g + '</th><th class="transparent"></th></tr><tr><th>Away</th><th class="transparent"></th><th>Home</th><th class="transparent"></th></tr>';

    d = b.length;
    for (h = 0; h < d; h++) {
        i = b[h];
        e = game_buttons(i);
		
		if((active_tab != 'week-18') && (active_tab != 'week-19') && (active_tab != 'week-20') && (active_tab != 'week-21')) {
			o = day_codes[game_position[i]];
		} else {
			o = playoff_day_codes[playoff_game_position[i]];
		}
		
        switch (o) {
            case "T":
                j += e;
                break;
            case " ":
            case "I":
            case "C":
            case "Z":
                a += e;
                break;
            case "N":
                f += e;
                break;
            case "M":
                k += e;
                break;
            default: alert("OUCH " + i);
                break
        }
    }
    c += j + a + f + k + "</table></div>";
    return c
}

function team_game_table(e, c, b) {
    var f, g, d, a; f = '<div style="float:left"><table class="gametable ' + b + '" ><tr><th class="transparent"></th><th class="' + b + '"      >Away</th><th class="transparent"></td><th class="' + b + '"      >Home</th><th class="transparent"></th></tr>'; g = team_week_lists[b]; for (d = e; d <= c; d++) { a = g[d - 1]; f += game_buttons(a, d) } f += "</table></div>"; return f
}

function game_buttons(i, a) {
    var b = (a == undefined) ? "" : "<td>" + a + " </td>", g, c, f, d, h, e;
    if (i == undefined) {
        e = "<tr>" + b + '<td class="byeweek" colspan="3">Bye week</td></tr>'
    } else {
        g = i.match(/(\w+)-(\w+)/);
        c = g[1];
        f = g[2];
        d = day_codes[game_position[i]];
		
		if((active_tab == 'week-18') || (active_tab == 'week-19') || (active_tab == 'week-20') || (active_tab == 'week-21')) {
			d = " ";
		}
		
        h = day_explaination[d];
        e = "<tr>" + b + '<td id="' + i + '-away-td" onclick="wgc( \'' + i + "', " + AWAY_WIN + ')"><div class="m-icon sp-m' + c + '" style="float: left"></div><div style="float:right;padding:3px">' + c + '<br>&nbsp;</div></td><td title="Click = to predict a tie."id="' + i + '-tie-td"  onclick="wgc( \'' + i + "', " + TIE_GAME + ')">&nbsp;=&nbsp;</td><td id="' + i + '-home-td" onclick="wgc( \'' + i + "', " + HOME_WIN + ')"><div style="float:left;padding:3px">' + f + '<br>&nbsp;</div><div class="m-icon sp-m' + f + '" style="float: right"></div></td><td title="' + h + '">' + d + "</td></tr>"
    }
    return e
}


function WLT_string(a) {
    return (a[TIES] === 0) ? a.slice(0, 2).join("-") : a.slice(0, 3).join("-")
}

function update_WLT_html(e, b, a, g, d) {
    var f, c;
    f = WLT_string(a);
    c = WLT_string(g);
    if (d !== "conf") {
        document.getElementById(e + "-" + d).innerHTML = f;
        document.getElementById(b + "-" + d).innerHTML = c
    }
    if (active_tab === e) {
        document.getElementById("team-" + d).innerHTML = f
    }
    else {
        if (active_tab === b) {
            document.getElementById("team-" + d).innerHTML = c
        }
    }
}

function modify_game(e, d, b, c, a) { 
	
	if((active_tab != 'week-18') && (active_tab != 'week-19') && (active_tab != 'week-20') && (active_tab != 'week-21')) {
		unpicked_games_count -= (c + a); 
		if (a == -1) { 
		
				modify_SOV(e, d, b, 0, -1); 
				modify_SOV(e, b, d, 0, -1)
				
		} else { 
		
			if (c == -1) { 
			
				modify_SOV(e, d, b, -1, 0) 
				
			} 
		} 
		
		game_work(d, b, all_record, all_pct, "WLT", c, a); 
		modify_SOS(d, c, 0, a); 
		modify_SOS(b, 0, c, a); 
		
		if (a == 1) { 
		
			modify_SOV(e, d, b, 0, 1); 
			modify_SOV(e, b, d, 0, 1) 
			
		} else { 
		
			if (c == 1) { 
			
				modify_SOV(e, d, b, 1, 0) 
			} 
		} 
		
		if (division[d][0] == division[b][0]) { 
		
			game_work(d, b, conf_record, conf_pct, "conf", c, a); 
			
			if (division[d] == division[b]) { 
			
				game_work(d, b, div_record, div_pct, "div", c, a) 
			} 
		}
		
		combinedPointsRank();
	}
} 

function game_work(i, h, d, g, b, c, a) { 

	var f = d[i], e = d[h]; 
	f[WINS] += c; 
	e[LOSSES] += c; 
	f[TIES] += a; 
	e[TIES] += a; 
	g[i] = calc_pct(f); 
	g[h] = calc_pct(e); 
	update_WLT_html(i, h, f, e, b) 
} 

function modify_SOV(e, j, i, n, r) { 

	var p = foe_lookup[j], o = foe_lookup[i], b, f, a, h, k, d, m, c, g, l, q; 
	c = SOV_record[j]; 
	g = all_record[i]; 
	c[WINS] += g[WINS] * n; 
	c[LOSSES] += g[LOSSES] * n; 
	c[TIES] += g[TIES] * n; 
	l = calc_pct(c); 
	SOV_pct[j] = l; 
	
	if (active_tab == j) { 
	
		document.getElementById("team-SOV").innerHTML = l.toFixed(3) 
	} 
	
	for (f = 0; f < unique_foes; f++) {

		b = p[f]; a = SOV_record[b]; 
		
		h = j + "-" + b; 
		k = (h == e) ? undefined : game_states[h]; 
		
		if (k == HOME_WIN) { 
		
			a[WINS] += n; a[TIES] += r 
		} 
		
		d = b + "-" + j; 
		m = (d == e) ? undefined : game_states[d]; 
		
		if (m == AWAY_WIN) { 
		
			a[WINS] += n; 
			a[TIES] += r 
		} 
		
		q = calc_pct(a); 
		SOV_pct[b] = q; 
		
		if (active_tab == b) { 
		
			document.getElementById("team-SOV").innerHTML = q.toFixed(3) 
		} 
		
		if (r === 0) { 
		
			b = o[f]; 
			a = SOV_record[b]; 
			h = i + "-" + b; 
			k = (h == e) ? undefined : game_states[h]; 
			
			if (k === HOME_WIN) { 
			
				a[LOSSES] += n 
			} 
			
			d = b + "-" + i; 
			m = (d == e) ? undefined : game_states[d]; 
			
			if (m === AWAY_WIN) { 
			
				a[LOSSES] += n 
			} 
			
			q = calc_pct(a); 
			SOV_pct[b] = q; 
			
			if (active_tab == b) { 
			
				document.getElementById("team-SOV").innerHTML = q.toFixed(3) 
			}
		} 
	} 
}

function modify_SOS(e, d, j, a) {
	
	var g = division[e], f = foe_lookup[e], c, b, h, i;
	
    for (i = unique_foes; i--;) {
		
		c = f[i];
		b = (division[c] == g) ? 2 : 1;
		h = SOS_record[c];
		h[WINS] += b * d;
		h[LOSSES] += b * j;
		h[TIES] += b * a;
		foe_SOS_pct = calc_pct(h);
		SOS_pct[c] = foe_SOS_pct;
		if (active_tab == c) {
				
			document.getElementById("team-SOS").innerHTML = foe_SOS_pct.toFixed(3)
			
		}
    }
};

function rnfl(elem) {
    isRNFLMarkdown = elem.checked;
    markdownExport();
}

function markdownExport() {
    var sb = [];
    var url = $("#save_string").html();
    if (!url) return;
    for (var conference in conferenceRankingObject) {
        var conferenceName = conferenceRankingObject[conference].name,
            conferenceLogo = '';
        if (isRNFLMarkdown) {
            conferenceLogo = "[](/" + conferenceName+")"
        }
        //1-6
        sb.push("#" + conferenceLogo + conferenceName+"\n\n");
        sb.push("Rank | Team | W | L | T\n");
        sb.push("-|-|-:|-:|-:|\n");

        for (var placement in conferenceRankingObject[conference].placements) {
            /* AFC
             *  1   |   KC  |  8 |  8   |   0   |
             */
            var team = conferenceRankingObject[conference].placements[placement],
                TeamLogo = '';
            if (isRNFLMarkdown) {
                TeamLogo = "[](/" + team.name + ")";
            }
            sb.push(placement + "|" + TeamLogo
                + "["+team.name +"]("+url+"#"+ team.name+")" + "|"
                + team.record[0] + "|"
                + team.record[1] + "|"
                + team.record[2] + "|\n");
        }
    }
    sb.push("[Generated by the NFL Playoff Predictor](" + url + ")");
    $("#markdownField").html(sb.join(''));
}

function update_outcomes() {
	
	//Season has not started yet
	alert("NFL Season has not started yet, so nothing was updated");
	
	//set_games_from_string('-WapWqmmlmamVppZmllqWqlqZVmqZVamWpaqapZaqaqmWllZVlmVmaappWmWllmVZqmlmZZWlmpFAAAAAAAAAAA_');
	//set_all_rankings();
    //set_game_cookie(cookie_letters, true);
	//edit_playoffs();
	//show_week_tab("week-16");
}


function explain_ties() {
	
	if(active_tab != 'help-tab' && active_tab != undefined) {
		
		var a = document.getElementById("autogen_tab");
		set_tabbing_buttons("tie-explain");
		a.innerHTML = '<h3>Tiebreaking explainations is still a work in progress</h3>'
		/*
		var i;
		
		a.innerHTML = '<ul>'
		
		for(i = 0; i < tie_explain.length; i++) {
			
			a.innerHTML += '<li>' + tie_explain[i] + '</li>';
		}
		a.innerHTML += '</ul>'
		*/
	}
}

function edit_playoffs() {
	
	try {
	
		//Wild Card
		var afcWildCard1 = conferenceRankingObject['AFC'].placements[5].name + '-' + conferenceRankingObject['AFC'].placements[4].name;
		var afcWildCard2 = conferenceRankingObject['AFC'].placements[6].name + '-' + conferenceRankingObject['AFC'].placements[3].name;
		var nfcWildCard1 = conferenceRankingObject['NFC'].placements[5].name + '-' + conferenceRankingObject['NFC'].placements[4].name;
		var nfcWildCard2 = conferenceRankingObject['NFC'].placements[6].name + '-' + conferenceRankingObject['NFC'].placements[3].name;
		week_lists[17] = [afcWildCard1, afcWildCard2, nfcWildCard1, nfcWildCard2];
		playoff_game_position[afcWildCard1] = 0;
		playoff_game_position[afcWildCard2] = 1;
		playoff_game_position[nfcWildCard1] = 2;
		playoff_game_position[nfcWildCard2] = 3;
		
		if((active_tab != 'week-18') && (active_tab != 'week-19') && (active_tab != 'week-20') && (active_tab != 'week-21')) {
			playoff_game_states[afcWildCard1] = 0;
			playoff_game_states[afcWildCard2] = 0;
			playoff_game_states[nfcWildCard1] = 0;
			playoff_game_states[nfcWildCard2] = 0;
		}
		
		//Divisional
		if(playoff_game_states[afcWildCard1] == 1 && playoff_game_states[afcWildCard2] == 1) {
			
			var afcDivisional1 = conferenceRankingObject['AFC'].placements[5].name + '-' + conferenceRankingObject['AFC'].placements[2].name;
			var afcDivisional2 = conferenceRankingObject['AFC'].placements[6].name + '-' + conferenceRankingObject['AFC'].placements[1].name;
		
		} else if(playoff_game_states[afcWildCard1] == 1 && playoff_game_states[afcWildCard2] == 2) {
			
			var afcDivisional1 = conferenceRankingObject['AFC'].placements[3].name + '-' + conferenceRankingObject['AFC'].placements[2].name;
			var afcDivisional2 = conferenceRankingObject['AFC'].placements[5].name + '-' + conferenceRankingObject['AFC'].placements[1].name;
			
		} else if(playoff_game_states[afcWildCard1] == 2 && playoff_game_states[afcWildCard2] == 1) {
			
			var afcDivisional1 = conferenceRankingObject['AFC'].placements[4].name + '-' + conferenceRankingObject['AFC'].placements[2].name;
			var afcDivisional2 = conferenceRankingObject['AFC'].placements[6].name + '-' + conferenceRankingObject['AFC'].placements[1].name;
			
		} else if(playoff_game_states[afcWildCard1] == 2 && playoff_game_states[afcWildCard2] == 2) {
			
			var afcDivisional1 = conferenceRankingObject['AFC'].placements[3].name + '-' + conferenceRankingObject['AFC'].placements[2].name;
			var afcDivisional2 = conferenceRankingObject['AFC'].placements[4].name + '-' + conferenceRankingObject['AFC'].placements[1].name;
			
		} else {
			
			var afcDivisional1 = 'NA-NA';
			var afcDivisional2 = 'NA-NA';
		}
		if(playoff_game_states[nfcWildCard1] == 1 && playoff_game_states[nfcWildCard2] == 1) {
			
			var nfcDivisional1 = conferenceRankingObject['NFC'].placements[5].name + '-' + conferenceRankingObject['NFC'].placements[2].name;
			var nfcDivisional2 = conferenceRankingObject['NFC'].placements[6].name + '-' + conferenceRankingObject['NFC'].placements[1].name;
		
		} else if(playoff_game_states[nfcWildCard1] == 1 && playoff_game_states[nfcWildCard2] == 2) {
			
			var nfcDivisional1 = conferenceRankingObject['NFC'].placements[3].name + '-' + conferenceRankingObject['NFC'].placements[2].name;
			var nfcDivisional2 = conferenceRankingObject['NFC'].placements[5].name + '-' + conferenceRankingObject['NFC'].placements[1].name;
			
		} else if(playoff_game_states[nfcWildCard1] == 2 && playoff_game_states[nfcWildCard2] == 1) {
			
			var nfcDivisional1 = conferenceRankingObject['NFC'].placements[4].name + '-' + conferenceRankingObject['NFC'].placements[2].name;
			var nfcDivisional2 = conferenceRankingObject['NFC'].placements[6].name + '-' + conferenceRankingObject['NFC'].placements[1].name;
			
		} else if(playoff_game_states[nfcWildCard1] == 2 && playoff_game_states[nfcWildCard2] == 2) {
			
			var nfcDivisional1 = conferenceRankingObject['NFC'].placements[3].name + '-' + conferenceRankingObject['NFC'].placements[2].name;
			var nfcDivisional2 = conferenceRankingObject['NFC'].placements[4].name + '-' + conferenceRankingObject['NFC'].placements[1].name;
			
		} else {
			
			var nfcDivisional1 = 'NA-NA';
			var nfcDivisional2 = 'NA-NA';
		}
		
		if(afcDivisional1 != 'NA-NA' && afcDivisional2 != 'NA-NA' && nfcDivisional1 != 'NA-NA' && nfcDivisional2 != 'NA-NA') {
			week_lists[18] = [afcDivisional1, afcDivisional2, nfcDivisional1, nfcDivisional2];
		} else {
			week_lists[18] = [];
		}
		
		playoff_game_position[afcDivisional1] = 4;
		playoff_game_position[afcDivisional2] = 5;
		playoff_game_position[nfcDivisional1] = 6;
		playoff_game_position[nfcDivisional2] = 7;
		
		if((active_tab != 'week-19') && (active_tab != 'week-20') && (active_tab != 'week-21')) {
			
			playoff_game_states[afcDivisional1] = 0;
			playoff_game_states[afcDivisional2] = 0;
			playoff_game_states[nfcDivisional1] = 0;
			playoff_game_states[nfcDivisional2] = 0;
		}
		
		//Conference Championships
		if(playoff_game_states[afcDivisional1] == 2 && playoff_game_states[afcDivisional2] == 2) {
			
			var afcChampionship = conferenceRankingObject['AFC'].placements[2].name + '-' + conferenceRankingObject['AFC'].placements[1].name;
		
		} else if(playoff_game_states[afcDivisional1] == 1 && playoff_game_states[afcDivisional2] == 2) {
			
			var splitter = afcDivisional1.split("-");
			var afcChampionship = splitter[0] + '-' + conferenceRankingObject['AFC'].placements[1].name;
			
		} else if(playoff_game_states[afcDivisional1] == 2 && playoff_game_states[afcDivisional2] == 1) {
			
			var splitter = afcDivisional2.split("-");
			var afcChampionship = splitter[0] + '-' + conferenceRankingObject['AFC'].placements[2].name;
			
		} else if(playoff_game_states[afcDivisional1] == 1 && playoff_game_states[afcDivisional2] == 1) {
			
			var splitter1 = afcDivisional1.split("-");
			var splitter2 = afcDivisional2.split("-");
			var afcChampionship = splitter2[0] + '-' + splitter1[0];
			
		} else {
			
			var afcChampionship = 'NA-NA';
		}
		if(playoff_game_states[nfcDivisional1] == 2 && playoff_game_states[nfcDivisional2] == 2) {
			
			var nfcChampionship = conferenceRankingObject['NFC'].placements[2].name + '-' + conferenceRankingObject['NFC'].placements[1].name;
		
		} else if(playoff_game_states[nfcDivisional1] == 1 && playoff_game_states[nfcDivisional2] == 2) {
			
			var splitter = nfcDivisional1.split("-");
			var nfcChampionship = splitter[0] + '-' + conferenceRankingObject['NFC'].placements[1].name;
			
		} else if(playoff_game_states[nfcDivisional1] == 2 && playoff_game_states[nfcDivisional2] == 1) {
			
			var splitter = nfcDivisional2.split("-");
			var nfcChampionship = splitter[0] + '-' + conferenceRankingObject['NFC'].placements[2].name;
			
		} else if(playoff_game_states[nfcDivisional1] == 1 && playoff_game_states[nfcDivisional2] == 1) {
			
			var splitter1 = nfcDivisional1.split("-");
			var splitter2 = nfcDivisional2.split("-");
			var nfcChampionship = splitter2[0] + '-' + splitter1[0];
			
		} else {
			
			var nfcChampionship = 'NA-NA';
		}
		
		if(afcChampionship != 'NA-NA' && nfcChampionship != 'NA-NA') {
		week_lists[19] = [afcChampionship, nfcChampionship];
		} else {
			week_lists[19] = [];
		}
		
		playoff_game_position[afcChampionship] = 8;
		playoff_game_position[nfcChampionship] = 9;
		
		if((active_tab != 'week-20') && (active_tab != 'week-21')) {
			playoff_game_states[afcChampionship] = 0;
			playoff_game_states[nfcChampionship] = 0;
		}
		
		//Super Bowl
		if(playoff_game_states[afcChampionship] == 1) {
			
			var splitter3 = afcChampionship.split("-");
			var afcChampion = splitter3[0];
		
		} else if(playoff_game_states[afcChampionship] == 2) {
			
			var splitter3 = afcChampionship.split("-");
			var afcChampion = splitter3[1];
			
		} else {
			
			var afcChampion = 'NA';
		}
		if(playoff_game_states[nfcChampionship] == 1) {
			
			var splitter4 = nfcChampionship.split("-");
			var nfcChampion = splitter4[0];
		
		} else if(playoff_game_states[nfcChampionship] == 2) {
			
			var splitter4 = nfcChampionship.split("-");
			var nfcChampion = splitter4[1];
			
		} else {
			
			var nfcChampion = 'NA';
		}
		var superBowl = nfcChampion + '-' + afcChampion;
		
		if(superBowl != 'NA-NA') {
			
			week_lists[20] = [superBowl];
		
		} else {
			
			week_lists[20] = [];
		}
		
		playoff_game_position[superBowl] = 10;
		
		if(active_tab != 'week-21') {
			
			playoff_game_states[superBowl] = 0;
		}
	
	} catch(err) {
		
		//Do Nothing
	}
}
