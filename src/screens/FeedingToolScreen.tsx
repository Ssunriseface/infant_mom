import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../theme/colors';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useRecords } from '../contexts/RecordContext';

const ages = ['4–6 个月', '6–8 个月', '8–10 个月', '10–12 个月', '1–2 岁'];

const defaultRecipes = [
  {
    name: '南瓜蛋黄泥',
    tag: '6m+',
    time: '15 分钟',
    difficulty: '简单',
    allergy: '无过敏源',
    ingredients: '南瓜 50g / 蛋黄 1 个 / 温水适量',
    steps: ['南瓜去皮切小块，蒸 10 分钟至软烂', '鸡蛋煮熟取蛋黄，用勺子碾碎', '南瓜 + 蛋黄 + 少许温水，搅打成泥'],
  },
  {
    name: '胡萝卜猪肝泥',
    tag: '6m+ 补铁',
    time: '20 分钟',
    difficulty: '中等',
    allergy: '猪肝需新鲜',
    ingredients: '胡萝卜半根 / 猪肝 30g / 米粉 10g',
    steps: ['猪肝洗净去筋膜，清水浸泡 10 分钟去血水', '胡萝卜切片与猪肝一起蒸 12 分钟', '搅打成泥，拌入冲好的米粉中'],
  },
  {
    name: '西兰花鳕鱼粥',
    tag: '7m+ DHA',
    time: '25 分钟',
    difficulty: '中等',
    allergy: '确保鱼刺已剔除',
    ingredients: '鳕鱼 30g / 西兰花 20g / 大米粥 1 碗',
    steps: ['鳕鱼蒸 8 分钟，去刺碾碎', '西兰花焯水，切碎末', '大米粥煮好后，拌入鱼泥和西兰花碎'],
  },
];

export default function FeedingToolScreen() {
  const [activeAge, setActiveAge] = useState(1);
  const [customText, setCustomText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);
  const { isExpired } = useSubscription();
  const { addFeeding } = useRecords();

  const handleGenerate = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGeneratedRecipe(null);

    // Simulate AI generation delay (production: DeepSeek API)
    setTimeout(() => {
      setIsGenerating(false);
      const query = customText.trim() || '营养均衡';
      setGeneratedRecipe({
        name: query.includes('铁') ? '菠菜鸡肉泥' : query.includes('消化') ? '山药红枣泥' : '紫薯燕麦糊',
        tag: ages[activeAge].split(' ')[0] + (query.includes('铁') ? ' 补铁' : query.includes('消化') ? ' 易消化' : ''),
        time: '15 分钟',
        difficulty: '简单',
        allergy: '确认宝宝对以上食材不过敏',
        ingredients: query.includes('铁')
          ? '菠菜叶 20g / 鸡胸肉 40g / 米粉 10g'
          : query.includes('消化')
          ? '山药 60g / 红枣 3 颗 / 温水适量'
          : '紫薯 50g / 即食燕麦 15g / 配方奶 100ml',
        steps: query.includes('铁')
          ? ['菠菜焯水去草酸，沥干切碎', '鸡胸肉煮熟，撕碎后打成泥', '混合菠菜和鸡肉泥，拌入米粉']
          : query.includes('消化')
          ? ['山药去皮切块蒸 15 分钟', '红枣去核切碎', '山药 + 红枣 + 温水，搅打成泥']
          : ['紫薯去皮切块，蒸 15 分钟', '燕麦用热水泡软', '紫薯压泥，加入燕麦和配方奶拌匀'],
        isGenerated: true,
      });
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Age Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.ageSelector}
          contentContainerStyle={{ gap: 8 }}
        >
          {ages.map((age, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.ageChip, activeAge === i && styles.ageChipActive]}
              onPress={() => setActiveAge(i)}
            >
              <Text style={[styles.ageChipText, activeAge === i && styles.ageChipTextActive]}>
                {age}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Custom Generate Bar */}
        <View style={styles.generateBar}>
          <TextInput
            style={styles.generateInput}
            placeholder="自定义需求，如：补铁、易消化..."
            placeholderTextColor="#ccc"
            value={customText}
            onChangeText={setCustomText}
            editable={!isGenerating}
          />
          <TouchableOpacity
            style={[styles.generateBtn, isGenerating && styles.generateBtnDisabled]}
            onPress={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.generateBtnText}>AI 生成</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {isGenerating && (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>AI 正在为你定制食谱...</Text>
            <Text style={styles.loadingSub}>{customText.trim() || '基于月龄和营养需求分析中'}</Text>
          </View>
        )}

        {/* Generated Recipe */}
        {generatedRecipe && (
          <>
            <View style={styles.generatedLabel}>
              <Text style={styles.generatedLabelText}>✨ AI 为您生成</Text>
            </View>
            {isExpired ? (
              <View style={styles.paywallOverlay}>
                <View style={styles.paywallContent}>
                  <Text style={styles.paywallIcon}>🔒</Text>
                  <Text style={styles.paywallText}>试用已结束</Text>
                  <Text style={styles.paywallSub}>开通会员解锁完整 AI 食谱分析</Text>
                </View>
                <View style={styles.paywallBlurred}>
                  <RecipeCard recipe={generatedRecipe} highlight />
                </View>
              </View>
            ) : (
              <>
                <RecipeCard recipe={generatedRecipe} highlight />
                <TouchableOpacity
                  style={styles.saveRecordBtn}
                  onPress={() => {
                    addFeeding({
                      time: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`,
                      type: '辅食',
                      food: generatedRecipe.name,
                      amount: undefined,
                      note: generatedRecipe.tag,
                    });
                  }}
                >
                  <Text style={styles.saveRecordBtnText}>记录为今日辅食</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}

        {/* Recommended Recipes */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>{generatedRecipe ? '更多推荐' : '推荐食谱'}</Text>
        </View>

        {defaultRecipes.map((recipe, i) => (
          <RecipeCard key={i} recipe={recipe} />
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

function RecipeCard({ recipe, highlight }: { recipe: any; highlight?: boolean }) {
  return (
    <View style={[styles.recipeCard, highlight && styles.recipeCardHighlight]}>
      <View style={styles.recipeHeader}>
        <Text style={styles.recipeName}>{recipe.name}</Text>
        <View style={styles.recipeTag}>
          <Text style={styles.recipeTagText}>{recipe.tag}</Text>
        </View>
      </View>
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeInfoText}>⏱ {recipe.time}</Text>
        <Text style={styles.recipeInfoText}>{recipe.difficulty}</Text>
        <Text style={styles.recipeInfoText}>{recipe.allergy}</Text>
      </View>
      <Text style={styles.label}>食材</Text>
      <Text style={styles.ingredients}>{recipe.ingredients}</Text>
      <Text style={styles.label}>步骤</Text>
      {recipe.steps.map((step: string, j: number) => (
        <View key={j} style={styles.stepRow}>
          <View style={styles.stepNum}>
            <Text style={styles.stepNumText}>{j + 1}</Text>
          </View>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },

  ageSelector: { paddingHorizontal: 20, marginBottom: 14 },
  ageChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 18,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white,
  },
  ageChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  ageChipText: { fontSize: 12, color: '#555', fontWeight: '500' },
  ageChipTextActive: { color: Colors.white },

  generateBar: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 14, gap: 8 },
  generateInput: {
    flex: 1, paddingVertical: 12, paddingHorizontal: 14,
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    fontSize: 13, color: Colors.text, backgroundColor: Colors.white,
  },
  generateBtn: {
    paddingHorizontal: 20, paddingVertical: 12,
    backgroundColor: Colors.primary, borderRadius: 10, justifyContent: 'center',
    minWidth: 90, alignItems: 'center',
  },
  generateBtnDisabled: { backgroundColor: '#9bb5d8' },
  generateBtnText: { fontSize: 13, fontWeight: '600', color: Colors.white },

  loadingCard: {
    marginHorizontal: 20, marginBottom: 14, backgroundColor: Colors.white,
    borderRadius: 14, padding: 30, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  loadingText: { fontSize: 15, fontWeight: '600', color: Colors.text, marginTop: 16 },
  loadingSub: { fontSize: 12, color: Colors.subtext, marginTop: 6 },

  generatedLabel: { paddingHorizontal: 20, marginBottom: 10 },
  generatedLabelText: { fontSize: 13, fontWeight: '700', color: Colors.primary },

  sectionLabel: { paddingHorizontal: 20, marginBottom: 10 },
  sectionLabelText: { fontSize: 13, fontWeight: '600', color: '#888' },

  recipeCard: {
    marginHorizontal: 20, marginBottom: 14, backgroundColor: Colors.white,
    borderRadius: 14, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  recipeCardHighlight: {
    borderWidth: 2, borderColor: Colors.primary,
  },
  recipeHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  recipeName: { fontSize: 16, fontWeight: '600', color: Colors.text },
  recipeTag: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
    backgroundColor: Colors.ok,
  },
  recipeTagText: { fontSize: 10, fontWeight: '500', color: Colors.okText },
  recipeInfo: { flexDirection: 'row', gap: 18, marginBottom: 12 },
  recipeInfoText: { fontSize: 11, color: Colors.subtext },

  label: { fontSize: 12, fontWeight: '600', color: '#888', marginBottom: 4 },
  ingredients: { fontSize: 13, color: '#555', marginBottom: 12 },

  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  stepNum: {
    width: 22, height: 22, borderRadius: 6, backgroundColor: '#f5f7fb',
    alignItems: 'center', justifyContent: 'center', marginRight: 6, marginTop: 1,
  },
  stepNumText: { fontSize: 11, fontWeight: '600', color: Colors.primary },
  stepText: { fontSize: 13, color: '#555', lineHeight: 23, flex: 1 },

  paywallOverlay: { position: 'relative', marginHorizontal: 20, marginBottom: 14 },
  paywallBlurred: { opacity: 0.25, overflow: 'hidden', borderRadius: 14 },
  paywallContent: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 14,
  },
  paywallIcon: { fontSize: 36, marginBottom: 10 },
  paywallText: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  paywallSub: { fontSize: 13, color: Colors.subtext, textAlign: 'center' },

  saveRecordBtn: {
    marginHorizontal: 20, marginBottom: 14,
    paddingVertical: 12, backgroundColor: Colors.ok,
    borderRadius: 10, alignItems: 'center',
  },
  saveRecordBtnText: { fontSize: 14, fontWeight: '600', color: Colors.okText },
});
