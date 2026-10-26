import React, { useState, useEffect } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { 
  initDriveAuth, 
  signInWithGoogle, 
  logoutGoogle, 
  backupToGoogleDrive, 
  listGoogleDriveBackups, 
  downloadGoogleDriveBackup, 
  exportReportToGoogleDrive, 
  deleteGoogleDriveFile, 
  DriveFileItem,
  AppBackupData 
} from '../services/googleDriveService';
import { User } from 'firebase/auth';
import { 
  Cloud, 
  UploadCloud, 
  DownloadCloud, 
  FileText, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  LogOut, 
  ShieldCheck,
  RefreshCw,
  FolderArchive
} from 'lucide-react';

export const GoogleDriveSync: React.FC = () => {
  const { 
    userProfile, 
    completedDays, 
    completedWorkouts, 
    weightRecords, 
    updateProfile,
    toggleDayManualCompletion
  } = useWorkout();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isOperating, setIsOperating] = useState(false);
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<DriveFileItem | null>(null);
  const [restoreConfirmTarget, setRestoreConfirmTarget] = useState<DriveFileItem | null>(null);

  // Initialize Auth state listener
  useEffect(() => {
    const unsubscribe = initDriveAuth(
      (user, token) => {
        setCurrentUser(user);
        loadFiles();
      },
      () => {
        setCurrentUser(null);
        setDriveFiles([]);
      }
    );
    return () => unsubscribe();
  }, []);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const loadFiles = async () => {
    try {
      const files = await listGoogleDriveBackups();
      setDriveFiles(files);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleLogin = async () => {
    setIsAuthenticating(true);
    try {
      const res = await signInWithGoogle();
      if (res?.user) {
        setCurrentUser(res.user);
        showStatus('success', `Conectado ao Google Drive com sucesso como ${res.user.displayName || res.user.email}!`);
        await loadFiles();
      }
    } catch (err: any) {
      showStatus('error', err.message || 'Falha ao autenticar com o Google Drive');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setCurrentUser(null);
    setDriveFiles([]);
    showStatus('success', 'Desconectado do Google Drive.');
  };

  // 1. Create JSON Backup
  const handleCreateBackup = async () => {
    if (!currentUser) return;
    setIsOperating(true);
    try {
      const backupData: AppBackupData = {
        appName: 'Treino em Casa meu suor!',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        userProfile,
        completedDays,
        completedWorkouts,
        weightRecords
      };

      const file = await backupToGoogleDrive(backupData);
      showStatus('success', `Backup salvo com sucesso no Google Drive: ${file.name}`);
      await loadFiles();
    } catch (err: any) {
      showStatus('error', err.message || 'Erro ao realizar backup no Google Drive.');
    } finally {
      setIsOperating(false);
    }
  };

  // 2. Restore Backup from Drive
  const handleExecuteRestore = async (file: DriveFileItem) => {
    setIsOperating(true);
    try {
      const data = await downloadGoogleDriveBackup(file.id);
      
      // Restore profile
      if (data.userProfile) {
        updateProfile(data.userProfile);
      }
      
      // Save data back to localStorage
      if (data.completedDays) {
        localStorage.setItem('treino_em_casa_completed_days_v1', JSON.stringify(data.completedDays));
      }
      if (data.completedWorkouts) {
        localStorage.setItem('treino_em_casa_completed_workouts_v1', JSON.stringify(data.completedWorkouts));
      }
      if (data.weightRecords) {
        localStorage.setItem('treino_em_casa_weights_v1', JSON.stringify(data.weightRecords));
      }

      showStatus('success', `Progresso restaurado com sucesso a partir de "${file.name}"! Recarregue a página para atualizar.`);
      setRestoreConfirmTarget(null);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      showStatus('error', err.message || 'Falha ao restaurar dados do Google Drive.');
    } finally {
      setIsOperating(false);
    }
  };

  // 3. Export Formatted Training Log Document
  const handleExportReport = async () => {
    if (!currentUser) return;
    setIsOperating(true);
    try {
      const reportTitle = `Relatorio_Treino_Em_Casa_${userProfile.name}`;
      const reportText = `================================================
RELATÓRIO DE TREINOS - TREINO EM CASA MEU SUOR!
Gerado em: ${new Date().toLocaleString('pt-BR')}
================================================

ATLETA: ${userProfile.name}
Objetivo: ${userProfile.goal}
Nível: ${userProfile.experienceLevel}
Altura: ${userProfile.heightCm} cm
Peso Inicial: ${userProfile.initialWeight} kg
Peso Atual: ${userProfile.currentWeight} kg
Meta de Peso: ${userProfile.targetWeight} kg
Diferença: ${(userProfile.currentWeight - userProfile.initialWeight).toFixed(1)} kg

ESTATÍSTICAS GERAIS:
- Dias Concluídos no Programa: ${completedDays.length} de 30 dias (${Math.round((completedDays.length / 30) * 100)}%)
- Sequência Atual: ${userProfile.streakDays} dias seguidos
- Estimativa de Calorias Gastas: ~${completedDays.length * 90} kcal
- Tempo Total Ativo: ~${completedDays.length * 15} minutos

HISTÓRICO DE PESAGENS (${weightRecords.length} registros):
${weightRecords.map((w) => `• ${w.date}: ${w.weight.toFixed(1)} kg ${w.note ? `(${w.note})` : ''}`).join('\n')}

TREINOS RECENTES CONCLUÍDOS (${completedWorkouts.length} sessões):
${completedWorkouts.map((cw) => `• ${cw.title} - ${new Date(cw.completedAt).toLocaleDateString('pt-BR')} (~${Math.floor(cw.durationSeconds / 60)} min | ~${cw.caloriesBurned} kcal)`).join('\n')}

================================================
Treino em Casa meu suor! - Exercícios sem equipamentos
`;

      const file = await exportReportToGoogleDrive(reportTitle, reportText);
      showStatus('success', `Relatório em texto salvo no Google Drive: ${file.name}`);
      await loadFiles();
    } catch (err: any) {
      showStatus('error', err.message || 'Erro ao exportar relatório para o Google Drive.');
    } finally {
      setIsOperating(false);
    }
  };

  // 4. Delete file (MANDATORY explicit confirmation)
  const handleExecuteDelete = async (file: DriveFileItem) => {
    setIsOperating(true);
    try {
      await deleteGoogleDriveFile(file.id);
      showStatus('success', `Arquivo "${file.name}" excluído do Google Drive.`);
      setDeleteConfirmTarget(null);
      await loadFiles();
    } catch (err: any) {
      showStatus('error', err.message || 'Falha ao excluir arquivo do Google Drive.');
    } finally {
      setIsOperating(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Sincronização com Google Drive</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                Oficial Google
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Faça backup do seu progresso de 30 dias, peso e relatórios diretamente na sua conta do Google Drive.
            </p>
          </div>
        </div>

        {/* Login or User badge */}
        <div>
          {currentUser ? (
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-2xl p-1.5 pr-3">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Google User'}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-xl object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                  {currentUser.displayName?.charAt(0) || 'G'}
                </div>
              )}
              <div className="text-left">
                <div className="text-xs font-bold text-white truncate max-w-[120px]">
                  {currentUser.displayName || 'Usuário Google'}
                </div>
                <div className="text-[10px] text-zinc-400 truncate max-w-[120px]">
                  {currentUser.email}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors ml-1"
                title="Desconectar do Google"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              disabled={isAuthenticating}
              className="min-h-[44px] px-4 py-2 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-semibold text-xs flex items-center gap-2.5 shadow-md active:scale-95 transition-all"
            >
              <svg viewBox="0 0 48 48" className="w-4 h-4">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span>{isAuthenticating ? 'Conectando...' : 'Conectar com Google Drive'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/15 border border-red-500/30 text-red-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {currentUser ? (
        <div className="space-y-4">
          {/* Action buttons row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Backup Button */}
            <button
              onClick={handleCreateBackup}
              disabled={isOperating}
              className="p-4 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 text-left flex items-start gap-3 transition-colors group active:scale-[0.99]"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Criar Backup no Google Drive</span>
                  {isOperating && <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Salva {completedDays.length} dias de treino, pesagens e metas em arquivo JSON seguro na sua nuvem.
                </div>
              </div>
            </button>

            {/* Export Report Button */}
            <button
              onClick={handleExportReport}
              disabled={isOperating}
              className="p-4 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 text-left flex items-start gap-3 transition-colors group active:scale-[0.99]"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Exportar Relatório Formatado</span>
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Gera um documento de texto com seu histórico completo e evolução para guardar no Drive.
                </div>
              </div>
            </button>
          </div>

          {/* Google Drive Files List */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderArchive className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white">Seus Arquivos do App no Google Drive</span>
              </div>
              <button
                onClick={loadFiles}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 p-1"
                title="Recarregar arquivos"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Atualizar</span>
              </button>
            </div>

            {driveFiles.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 text-xs">
                Nenhum backup encontrado no Google Drive ainda. Clique em "Criar Backup no Google Drive" acima para salvar seus dados na nuvem!
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/60 max-h-60 overflow-y-auto">
                {driveFiles.map((file) => {
                  const isJson = file.name.endsWith('.json') || file.mimeType.includes('json');
                  const dateStr = new Date(file.modifiedTime).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div key={file.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                          {isJson ? <UploadCloud className="w-3.5 h-3.5 text-blue-400" /> : <FileText className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                            {file.name}
                          </div>
                          <div className="text-[10px] text-zinc-500">
                            Modificado em: {dateStr}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Restore button (only for JSON backups) */}
                        {isJson && (
                          <button
                            onClick={() => setRestoreConfirmTarget(file)}
                            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-semibold text-emerald-400 flex items-center gap-1 transition-colors"
                            title="Restaurar dados deste backup"
                          >
                            <DownloadCloud className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Restaurar</span>
                          </button>
                        )}

                        {/* Open in Google Drive Link */}
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                            title="Abrir no Google Drive"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {/* Delete button (with confirmation modal) */}
                        <button
                          onClick={() => setDeleteConfirmTarget(file)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
                          title="Excluir do Google Drive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-400 leading-relaxed">
            Conecte sua conta do Google Drive com 1 clique para habilitar backups automáticos e nunca perder o histórico dos seus 30 dias de treino mesmo se trocar de dispositivo.
          </div>
        </div>
      )}

      {/* Mandatory Explicit Confirmation Dialog for Deletion */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-white">Excluir Arquivo do Google Drive?</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tem certeza de que deseja excluir permanentemente o arquivo <strong className="text-white">"{deleteConfirmTarget.name}"</strong> do seu Google Drive?
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmTarget(null)}
                className="flex-1 h-11 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white font-medium text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleExecuteDelete(deleteConfirmTarget)}
                disabled={isOperating}
                className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                {isOperating ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Confirmar Exclusão</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Explicit Confirmation Dialog for Restoring Backup */}
      {restoreConfirmTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <DownloadCloud className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-white">Restaurar Dados do Google Drive?</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Os dados locais deste dispositivo serão sincronizados com as informações salvas no arquivo <strong className="text-white">"{restoreConfirmTarget.name}"</strong>.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setRestoreConfirmTarget(null)}
                className="flex-1 h-11 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white font-medium text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleExecuteRestore(restoreConfirmTarget)}
                disabled={isOperating}
                className="flex-1 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                {isOperating ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Confirmar Restauração</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
