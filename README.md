# shukway-apps

שני אתרים סטטיים (prebuilt) ל-Render Static Sites, על תתי-דומיין של shukway.com.

| תיקייה | מה | תת-דומיין מיועד |
|---|---|---|
| `map/` | השוק החי — מפת וקטור MapLibre+PMTiles, 527 דוכנים, ניווט, "אני ליד" | `map.shukway.com` |
| `dashboard/` | דשבורד בעלי עסקים + קופונים (`#coupons` deep-link) | `dashboard.shukway.com` |

## פריסה ב-Render (לכל תיקייה)
1. Render → **New → Static Site** → חבר את ה-repo הזה.
2. **Root Directory:** `map` (ואז שוב Static Site עם `dashboard`).
3. **Build Command:** השאר ריק / `echo skip` (האתרים כבר בנויים).
4. **Publish Directory:** `.`
5. אחרי deploy → **Settings → Custom Domains** → הוסף `map.shukway.com` → Render ייתן יעד CNAME.
6. **GoDaddy → DNS** → הוסף CNAME: `map` → היעד. (וכנ"ל `dashboard`.)

הערות:
- שני האתרים סטטיים נטו, ללא backend, ללא trackers. PMTiles נטען ב-range-requests (Render Static תומך).
- אין צורך ב-rewrite-to-index (המפה היא index יחיד; הדשבורד עם hash-routing).
- לעדכון: בונים מחדש מקומית ודוחפים את התיקיות המעודכנות.
